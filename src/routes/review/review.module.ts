import { Module } from '@nestjs/common'
import { ReviewController } from './review.controller'
import { ReviewRepo } from './review.repo'
import { ReviewService } from './review.service'

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepo]
})
export class ReviewModule {}
