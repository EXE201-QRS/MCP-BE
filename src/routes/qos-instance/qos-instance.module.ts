import { Module } from '@nestjs/common'
import { SubscriptionModule } from '../subscription/subscription.module'
import { QosInstanceController } from './qos-instance.controller'
import { QosInstanceRepo } from './qos-instance.repo'
import { QosInstanceService } from './qos-instance.service'

@Module({
  imports: [SubscriptionModule],
  controllers: [QosInstanceController],
  providers: [QosInstanceService, QosInstanceRepo]
})
export class QosInstanceModule {}
