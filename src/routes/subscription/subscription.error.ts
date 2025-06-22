import { UnauthorizedException } from '@nestjs/common'

export const UnathoriedAfterPaymentException = new UnauthorizedException([
  {
    message: 'Error.UnathoriedAfterPayment'
  }
])
