import { Module } from '@nestjs/common'
import { ServicePlanModule } from '../service-plan/service-plan.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { PaymentController } from './payment.controller'
import { PaymentRepo } from './payment.repo'
import { PaymentService } from './payment.service'

@Module({
  imports: [SubscriptionModule, ServicePlanModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepo]
})
export class PaymentModule {}
