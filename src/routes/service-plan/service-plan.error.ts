import { UnprocessableEntityException } from '@nestjs/common'

export const ServicePlanAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.ServicePlanAlreadyExists',
    path: 'name'
  }
])
