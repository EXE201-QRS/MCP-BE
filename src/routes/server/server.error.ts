import { NotFoundException } from '@nestjs/common'

export const CusTomerFormServerExistsException = new NotFoundException([
  {
    message: 'Error.CusTomerFormServerExist',
    path: 'customerFormsId'
  }
])
