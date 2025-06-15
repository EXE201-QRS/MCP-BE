import { createZodDto } from 'nestjs-zod'
import {
  CreateCustomerFormBodySchema,
  GetCustomerFormDetailResSchema,
  GetCustomerFormParamsSchema,
  GetCustomerFormsResSchema,
  UpdateCustomerFormBodySchema
} from './customer-form.model'

export class GetCustomerFormDetailResDTO extends createZodDto(
  GetCustomerFormDetailResSchema
) {}

export class GetCustomerFormParamsDTO extends createZodDto(GetCustomerFormParamsSchema) {}

export class GetCustomerFormsResDTO extends createZodDto(GetCustomerFormsResSchema) {}

export class CreateCustomerFormBodyDTO extends createZodDto(
  CreateCustomerFormBodySchema
) {}

export class UpdateCustomerFormBodyDTO extends createZodDto(
  UpdateCustomerFormBodySchema
) {}
