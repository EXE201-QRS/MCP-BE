import { createZodDto } from 'nestjs-zod'
import {
  CreateServicePlanBodySchema,
  GetServicePlanDetailResSchema,
  GetServicePlanParamsSchema,
  GetServicePlansResSchema,
  UpdateServicePlanBodySchema
} from './service-plan.model'

export class GetServicePlanDetailResDTO extends createZodDto(
  GetServicePlanDetailResSchema
) {}

export class GetServicePlanParamsDTO extends createZodDto(GetServicePlanParamsSchema) {}
export class GetServicePlansResDTO extends createZodDto(GetServicePlansResSchema) {}

export class CreateServicePlanBodyDTO extends createZodDto(CreateServicePlanBodySchema) {}

export class UpdateServicePlanBodyDTO extends createZodDto(UpdateServicePlanBodySchema) {}
