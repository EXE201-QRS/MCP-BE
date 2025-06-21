import {
  CreateCustomerBodySchema,
  GetCustomerDetailResSchema,
  GetCustomerDetailResWithUserSchema,
  GetCustomeresResSchema,
  GetCustomerParamsSchema,
  UpdateCustomerBodySchema
} from '@/routes/customer/customer.model'
import { createZodDto } from 'nestjs-zod'

export class CreateCustomerBodyDTO extends createZodDto(CreateCustomerBodySchema) {}

export class UpdateCustomerBodyDTO extends createZodDto(UpdateCustomerBodySchema) {}

export class GetCustomerParamsDTO extends createZodDto(GetCustomerParamsSchema) {}

export class GetCustomerDetailResDTO extends createZodDto(GetCustomerDetailResSchema) {}

export class GetCustomerDetailResWithUserDTO extends createZodDto(
  GetCustomerDetailResWithUserSchema
) {}

export class GetCustomeresResDTO extends createZodDto(GetCustomeresResSchema) {}
