import { Module } from '@nestjs/common'
import { SubscriptionModule } from '../subscription/subscription.module'
import { ReviewController } from './review.controller'
import { ReviewRepo } from './review.repo'
import { ReviewService } from './review.service'

@Module({
  imports: [SubscriptionModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepo]
})
export class ReviewModule {}
