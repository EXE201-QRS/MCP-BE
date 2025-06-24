import { PAYMENT_MESSAGE } from '@/common/constants/message'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/common/constants/payment.constant'
import { SubscriptionStatus } from '@/common/constants/subscription.constant'
import envConfig from '@/config/env.config'
import { mapEnumToDays } from '@/shared/helpers'

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'

import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { EmailService } from '@/shared/services/email.service'
import { PayOSService } from '@/shared/services/payos.service'
import { FailedToSendOTPException } from '../auth/auth.error'
import { ServicePlanRepo } from '../service-plan/service-plan.repo'
import { SubscriptionRepo } from '../subscription/subscription.repo'
import { CreatePayOSPaymentDto, PaymentType } from './payment.model'
import { PaymentRepo } from './payment.repo'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly subsRepo: SubscriptionRepo,
    private readonly payosService: PayOSService,
    private readonly serPlanRepo: ServicePlanRepo,
    private readonly emailService: EmailService,
    private readonly userService: SharedUserRepository
  ) {}
  // Create PayOS payment
  async createPayOSPayment(paymentData: CreatePayOSPaymentDto, userId: number) {
    try {
      const { subscriptionId, buyerName, buyerEmail, buyerPhone } = paymentData

      const subsItem = await this.subsRepo.findById(subscriptionId)

      //check subs với ser xem có ko
      if (!subsItem) {
        throw new NotFoundException(PAYMENT_MESSAGE.SUBSCRIPTION_NOT_FOUND)
      }
      const servicePlanItem = await this.serPlanRepo.findById(subsItem.servicePlanId)
      if (!servicePlanItem) {
        throw new NotFoundException(PAYMENT_MESSAGE.SERVICE_PLAN_NOT_FOUND)
      }
      if (
        subsItem.status !== SubscriptionStatus.PENDING &&
        subsItem.status !== SubscriptionStatus.EXPIRED
      ) {
        throw new ConflictException(
          'Đơn đăng ký phải ở trạng thái pending hoặc expired để thanh toán'
        )
      }

      if (subsItem.startDate && subsItem.endDate) {
        const start = subsItem.startDate.getTime()
        const end = subsItem.endDate.getTime()
        // check ngày ít hơn 3 ngày thì cho thanh toán
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000

        if (!(start < end + threeDaysInMs || end > start)) {
          throw new ConflictException('Đơn đăng ký chưa đến thời kì thanh toán')
        }
      }

      // Generate unique order code cho PayOS
      const orderCode = this.payosService.generateOrderCode()

      // Tạo URLs cho return và cancel
      const { returnUrl, cancelUrl } =
        this.payosService.generatePaymentUrls(subscriptionId)

      // Tạo items từ bill orders
      const items = this.payosService.createPayOSItems({
        subs: subsItem,
        ser: servicePlanItem
      })
      const count = parseInt(mapEnumToDays(subsItem.durationDays)) / 30
      const totalPrice = servicePlanItem.price * count

      // Tạo PayOS payment request
      const payosRequest = {
        orderCode,
        amount: totalPrice, // Tổng số tiền từ items
        description: `Payment for - ${servicePlanItem.name} `,
        items,
        buyerName,
        buyerEmail,
        buyerPhone,
        cancelUrl,
        returnUrl,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60 // 15 minutes from now
      }

      // Gọi PayOS API để tạo payment link
      const payosResponse = await this.payosService.createPaymentLink(payosRequest)

      //Create payment record trong database
      const payment = await this.paymentRepo.createPayment({
        userId: userId,
        subscriptionId: subsItem.id,
        paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
        amount: totalPrice,
        status: PAYMENT_STATUS.PENDING,
        payosOrderId: orderCode.toString(),
        payosPaymentLinkId: payosResponse.paymentLinkId,
        payosCheckoutUrl: payosResponse.checkoutUrl,
        payosQrCode: payosResponse.qrCode,
        expiredAt: new Date(payosResponse.expiredAt * 1000),
        processedById: userId
      })

      return {
        success: true,
        message: 'Tạo link thanh toán PayOS thành công',
        data: {
          payment,
          payosData: {
            orderCode: payosResponse.orderCode,
            checkoutUrl: payosResponse.checkoutUrl,
            qrCode: payosResponse.qrCode,
            paymentLinkId: payosResponse.paymentLinkId,
            expiredAt: payosResponse.expiredAt,
            amount: payosResponse.amount
          }
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException(
        `Lỗi khi tạo thanh toán PayOS: ${error.message || 'Unknown error'}`
      )
    }
  }

  // Handle PayOS return URL
  async handlePayOSReturn(returnData: {
    paymentId: number
    code: string
    paymentLinkId: string
    cancel: boolean
    status: string
    orderCode: number
  }) {
    const feUrl = envConfig.FE_URL || 'http://localhost:3000'
    try {
      const { paymentId, code, paymentLinkId, cancel, status, orderCode } = returnData
      // Tìm payment theo orderCode
      const payment = (await this.paymentRepo.findPaymentByPayOSOrderId(
        orderCode.toString()
      )) as PaymentType | null

      if (!payment) {
        // Redirect về frontend với error
        return {
          success: false,
          message: `Không tìm thấy thanh toán với orderCode: ${orderCode}`,
          redirect: `${feUrl}/payment/failed?error=payment_not_found&orderCode=${orderCode}`
        }
      }

      // Nếu đã thanh toán thành công trước đó
      if (payment.status === PAYMENT_STATUS.PAID) {
        // Lấy thêm thông tin subscription và service plan cho redirect
        const [subsItem, servicePlanItem] = await Promise.all([
          this.subsRepo.findById(payment.subscriptionId),
          payment.subscriptionId
            ? this.subsRepo
                .findById(payment.subscriptionId)
                .then((sub) =>
                  sub ? this.serPlanRepo.findById(sub.servicePlanId) : null
                )
            : null
        ])

        return {
          success: true,
          message: 'Thanh toán đã được xử lý thành công',
          redirect: `${feUrl}/payment/success?orderId=${payment.payosOrderId}&amount=${payment.amount}&planName=${encodeURIComponent(servicePlanItem?.name || '')}&restaurantName=${encodeURIComponent(subsItem?.restaurantName || '')}`
        }
      }

      // Xử lý theo code trả về từ PayOS
      if (code === '00' && status === 'PAID' && !cancel) {
        // Lấy thông tin subscription và service plan
        const [subsItem, servicePlanItem] = await Promise.all([
          this.subsRepo.findById(payment.subscriptionId),
          payment.subscriptionId
            ? this.subsRepo
                .findById(payment.subscriptionId)
                .then((sub) =>
                  sub ? this.serPlanRepo.findById(sub.servicePlanId) : null
                )
            : null
        ])

        // Thanh toán thành công
        await this.paymentRepo.updatePayment(payment.id, {
          status: PAYMENT_STATUS.PAID,
          paidAt: new Date(),
          gatewayResponse: returnData as any
        })

        // Hoàn thành bill payment
        await this.paymentRepo.completeBillPayment(payment.id, payment.subscriptionId)
        // send mail thông báo thanh toán thành công
        this.sendMailPayment(payment)
        return {
          success: true,
          message: 'Thanh toán thành công',
          redirect: `${feUrl}/payment/success?orderId=${payment.payosOrderId}&amount=${payment.amount}&planName=${encodeURIComponent(servicePlanItem?.name || '')}&restaurantName=${encodeURIComponent(subsItem?.restaurantName || '')}`
        }
      } else {
        // Thanh toán thất bại hoặc bị hủy
        const failureReason = cancel
          ? 'Người dùng hủy thanh toán'
          : `Thanh toán thất bại (code: ${code})`

        await this.paymentRepo.updatePayment(payment.id, {
          status: cancel ? PAYMENT_STATUS.CANCELLED : PAYMENT_STATUS.FAILED,
          failureReason,
          gatewayResponse: returnData as any
        })

        return {
          success: false,
          message: failureReason,
          redirect: `${feUrl}/payment/failed?error=payment_failed&orderCode=${orderCode}&reason=${encodeURIComponent(failureReason)}`
        }
      }
    } catch (error) {
      console.error('PayOS Return Handler Error:', error)
      return {
        success: false,
        message: `Lỗi xử lý return PayOS: ${error.message}`,
        redirect: `${feUrl}/payment/failed?error=system_error&orderCode=${returnData.orderCode}`
      }
    }
  }

  // Handle PayOS cancel URL
  async handlePayOSCancel(cancelData: {
    paymentId: number
    code: string
    paymentLinkId: string
    cancel: boolean
    status: string
    orderCode: number
  }) {
    const feUrl = envConfig.FE_URL || 'http://localhost:3000'
    try {
      const { paymentId, orderCode } = cancelData

      // Tìm payment theo orderCode
      const payment = await this.paymentRepo.findPaymentByPayOSOrderId(
        orderCode.toString()
      )

      if (payment && payment.status === PAYMENT_STATUS.PENDING) {
        // Cập nhật trạng thái hủy
        await this.paymentRepo.updatePayment(payment.id, {
          status: PAYMENT_STATUS.CANCELLED,
          failureReason: 'Người dùng hủy thanh toán',
          gatewayResponse: cancelData as any
        })
      }

      return {
        success: false,
        message: 'Thanh toán đã bị hủy',
        redirect: `${feUrl}/payment/failed?error=payment_cancelled&orderCode=${orderCode}`
      }
    } catch (error) {
      console.error('PayOS Cancel Handler Error:', error)
      return {
        success: false,
        message: `Lỗi xử lý cancel PayOS: ${error.message}`,
        redirect: `${feUrl}/payment/failed?error=system_error&orderCode=${cancelData.orderCode}`
      }
    }
  }

  async sendMailPayment(payment) {
    // 3. Gửi mail
    const subsItem = await this.subsRepo.findById(payment.subscriptionId)
    if (!subsItem) {
      throw new NotFoundException(PAYMENT_MESSAGE.SUBSCRIPTION_NOT_FOUND)
    }

    const [servicePlanItem, user] = await Promise.all([
      this.serPlanRepo.findById(subsItem.servicePlanId),
      this.userService.findUnique({ id: payment.userId })
    ])

    if (!servicePlanItem || !user) {
      throw new NotFoundException(PAYMENT_MESSAGE.INVALID_INFORMATION)
    }
    const { error } = await this.emailService.sendPayment({
      email: user.email,
      servicePlanName: servicePlanItem.name,
      amount: payment.amount,
      description: servicePlanItem.description || ''
    })
    if (error) {
      throw FailedToSendOTPException
    }
  }
}
