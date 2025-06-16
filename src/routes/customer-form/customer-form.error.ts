import { NotFoundException } from '@nestjs/common'

export const ServicePlanNotExistsException = new NotFoundException([
  {
    message: 'Error.ServicePlanNotExists',
    path: 'servicePlanId'
  }
])
