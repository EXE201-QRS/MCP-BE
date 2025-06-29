import { FailedToSendPaymentPException } from '@/routes/auth/auth.error'
import { mapEnumToDays } from '@/shared/helpers'
import { EmailService } from '@/shared/services/email.service'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SubscriptionStatus } from '@prisma/client'
import { addDays } from 'date-fns'
import { PrismaService } from 'src/shared/services/prisma.service'
@Injectable()
export class SendMailToPaymentCronjob {
  constructor(
    private prismaService: PrismaService,
    private readonly emailService: EmailService
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  async handleSendMailToPaid() {
    const nowPlus3Days = addDays(new Date(), 3)

    const subsMany = await this.prismaService.subscription.findMany({
      where: {
        endDate: {
          not: null,
          lt: nowPlus3Days,
          gte: new Date()
        },
        deletedAt: null,
        status: {
          notIn: [
            SubscriptionStatus.CANCELLED,
            SubscriptionStatus.PAID,
            SubscriptionStatus.PENDING
          ]
        }
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        servicePlan: {
          select: {
            name: true,
            price: true,
            description: true
          }
        }
      }
    })
    for (const subscription of subsMany) {
      const statusText =
        subscription.status === SubscriptionStatus.EXPIRED ? 'Hết hạn' : 'Sắp hết hạn'
      const { user, servicePlan, ...data } = subscription
      const countDate = parseInt(mapEnumToDays(subscription.durationDays)) || 30
      const { error } = await this.emailService.sendPayment({
        email: user.email,
        servicePlanName: servicePlan.name,
        amount: (countDate / 30) * servicePlan.price,
        description: servicePlan.description || '',
        statusPayment: statusText,
        buttonText: 'Bạn đã thanh toán chưa ?. Hãy thanh toán ngay'
      })

      if (error) {
        throw FailedToSendPaymentPException
      }
    }
  }
}
