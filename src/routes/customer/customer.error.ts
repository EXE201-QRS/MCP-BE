import { UnprocessableEntityException } from '@nestjs/common'

export const CustomerAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.CustomerAlreadyExists',
    path: 'userId'
  }
])
export const CustomerNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.CustomerNotFound',
    path: 'id'
  }
])
