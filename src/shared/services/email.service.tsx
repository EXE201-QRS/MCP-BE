import React from 'react'
import envConfig from '@/config/env.config'
import { Injectable } from '@nestjs/common'
import OTPEmail from 'emails/otp'
import { Resend } from 'resend'
import { PaymentEmail } from 'emails/PaymentEmail'
import CreateAccountEmail from 'emails/create-account'

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP'
    return this.resend.emails.send({
      from: 'Scanorderly <no-reply@scanorderly.com>',
      to: [payload.email],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />
    })
  }

  async sendPayment(payload: {
    email: string;
    servicePlanName: string;
    amount: number;
    description: string;
    statusPayment?: string;
    customerName?: string;
    restaurantName?: string;
    orderCode?: string;
  }) {
    const isPaid = payload.statusPayment === 'Đã thanh toán'
    const subject = isPaid
      ? '✅ Thanh toán thành công - Scanorderly'
      : 'Hóa đơn thanh toán dịch vụ - Scanorderly'

    return this.resend.emails.send({
      from: 'Scanorderly <no-reply@scanorderly.com>',
      to: [payload.email],
      subject,
      react: (
        <PaymentEmail
          title={payload.servicePlanName}
          price={payload.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          description={payload.description}
          statusPayment={payload.statusPayment || 'Chờ thanh toán'}
          customerName={payload.customerName}
          restaurantName={payload.restaurantName}
          orderCode={payload.orderCode}
          buttonText={isPaid ? undefined : 'Thanh toán dịch vụ Scanorderly'}
        />
      )
    })
  }

  async sendCreateAccountEmail(payload: {
    email: string;
    password: string;
    userName?: string
  }) {
    const subject = 'Tài khoản mới được tạo - Scanorderly'
    return this.resend.emails.send({
      from: 'Scanorderly <no-reply@scanorderly.com>',
      to: [payload.email],
      subject,
      react: (
        <CreateAccountEmail
          email={payload.email}
          password={payload.password}
          title={subject}
        />
      )
    })
  }
}
