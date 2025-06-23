import { BadRequestException } from '@nestjs/common'

export const SubscriptionHasNotBeenPaid = new BadRequestException([
  {
    message: 'Subscription has not been paid',
    path: 'subscriptionId'
  }
])
