import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionRepo } from './subscription.repo'
import { SubscriptionService } from './subscription.service'

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepo],
  exports: [SubscriptionService, SubscriptionRepo]
})
export class SubscriptionModule {}
