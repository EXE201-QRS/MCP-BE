import { PrismaService } from '@/shared/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreatePaymentType, PaymentType } from './payment.model'

@Injectable()
export class PaymentRepo {
  constructor(private prisma: PrismaService) {}
  // Payment CRUD operations
  async createPayment(data: CreatePaymentType): Promise<PaymentType> {
    return this.prisma.payment.create({
      data
    })
  }

  async findPaymentByPayOSOrderId(payosOrderId: string): Promise<PaymentType | null> {
    return this.prisma.payment.findFirst({
      where: {
        payosOrderId,
        deletedAt: null
      }
    })
  }

  async updatePayment(id: number, data: Prisma.PaymentUpdateInput): Promise<PaymentType> {
    return this.prisma.payment.update({
      where: { id },
      data
    })
  }

  async completeBillPayment(paymentId: number, subscriptionId: number): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      // Update payment status to PAID
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      })

      // Update bill status to PAID
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'PAID'
        }
      })
    })
  }
}
