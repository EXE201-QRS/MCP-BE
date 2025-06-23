import { PAYMENT_MESSAGE } from '@/common/constants/message'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/common/constants/payment.constant'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const PaymentSchema = z.object({
  id: z.number().int().positive(),
  userId: checkIdSchema(PAYMENT_MESSAGE.USER_ID_IS_INVALID),
  subscriptionId: checkIdSchema(PAYMENT_MESSAGE.SUBSCRIPTION_ID_IS_INVALID),
  paymentMethod: z
    .enum([PAYMENT_METHOD.BANK_TRANSFER])
    .default(PAYMENT_METHOD.BANK_TRANSFER),
  amount: z.number().min(0),
  status: z.enum([
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.PROCESSING,
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.FAILED,
    PAYMENT_STATUS.CANCELLED,
    PAYMENT_STATUS.EXPIRED,
    PAYMENT_STATUS.REFUNDED
  ]),
  payosOrderId: z.string().nullable(),
  payosPaymentLinkId: z.string().nullable(),
  payosTransactionId: z.string().nullable(),
  payosQrCode: z.string().nullable(),
  payosCheckoutUrl: z.string().url().nullable(),
  receivedAmount: z.number().min(0).nullable(),
  changeAmount: z.number().min(0).nullable(),
  gatewayResponse: z.any().nullable(),
  failureReason: z.string().max(1000).nullable(),
  paidAt: z.date().nullable(),
  expiredAt: z.date().nullable(),
  processedById: z.number().int().positive().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

const CreatePaymentSchema = PaymentSchema.pick({
  userId: true,
  subscriptionId: true,
  paymentMethod: true,
  amount: true,
  status: true,
  payosOrderId: true,
  payosPaymentLinkId: true,
  payosQrCode: true,
  payosCheckoutUrl: true,
  expiredAt: true,
  processedById: true
})

// Create PayOS Payment DTO
const CreatePayOSPaymentSchema = z.object({
  subscriptionId: z.number().int().positive(),
  buyerName: z.string().max(255).optional(),
  buyerEmail: z.string().email().optional(),
  buyerPhone: z.string().max(20).optional(),
  buyerAddress: z.string().max(500).optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})
// Payment Response DTO
const PaymentResponseSchema = PaymentSchema.extend({
  bill: z
    .object({
      id: z.number(),
      billNumber: z.string(),
      tableNumber: z.number(),
      totalAmount: z.number(),
      status: z.enum(['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'])
    })
    .optional(),
  processedBy: z
    .object({
      id: z.number(),
      name: z.string(),
      email: z.string()
    })
    .optional()
})

// PayOS Webhook DTO
const PayOSWebhookSchema = z.object({
  code: z.string(),
  desc: z.string(),
  data: z.object({
    orderCode: z.number(),
    amount: z.number(),
    description: z.string(),
    accountNumber: z.string().optional(),
    reference: z.string().optional(),
    transactionDateTime: z.string(),
    currency: z.string().default('VND'),
    paymentLinkId: z.string(),
    code: z.string(),
    desc: z.string(),
    counterAccountBankId: z.string().optional(),
    counterAccountBankName: z.string().optional(),
    counterAccountName: z.string().optional(),
    counterAccountNumber: z.string().optional(),
    virtualAccountName: z.string().optional(),
    virtualAccountNumber: z.string().optional()
  }),
  signature: z.string()
})

export interface PaymentWithBill {
  id: number
  paymentId: number
  paymentMethod: string
  amount: number
  status: string
  payosOrderId?: string
}

export class PayOSWebhookDto extends createZodDto(PayOSWebhookSchema) {}

export class CreatePayOSPaymentDto extends createZodDto(CreatePayOSPaymentSchema) {}

export class PaymentResponseDto extends createZodDto(PaymentResponseSchema) {}
export type PaymentType = z.infer<typeof PaymentSchema>

export type CreatePaymentType = z.infer<typeof CreatePaymentSchema>
