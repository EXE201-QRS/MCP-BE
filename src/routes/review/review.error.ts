import { BadRequestException } from '@nestjs/common'

export const SubscriptionHasNotPaidToReview = new BadRequestException([
  {
    message: 'Error.SubscriptionStatusIsNotPaidToReview'
  }
])

export const UnAuthorizatedToReview = new BadRequestException([
  {
    message: 'Error.UnAuthorizatedToReview',
    path: 'userId'
  }
])
