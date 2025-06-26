import { createZodDto } from 'nestjs-zod'
import {
  CreateSubscriptionBodySchema,
  GetSubscriptionDetailResSchema,
  GetSubscriptionDetailResWithUserServicePlanSchema,
  GetSubscriptionesResSchema,
  GetSubscriptionParamsSchema,
  SubscriptionWithQosInstanceServicePlanResSchema,
  UpdateSubscriptionBodySchema
} from './subscription.model'

export class GetSubscriptionParamsDTO extends createZodDto(GetSubscriptionParamsSchema) {}

export class GetSubscriptionDetailResDTO extends createZodDto(
  GetSubscriptionDetailResSchema
) {}

export class GetSubscriptionDetailResWithUserServicePlanDTO extends createZodDto(
  GetSubscriptionDetailResWithUserServicePlanSchema
) {}

export class GetSubscriptionWithQosInstanceServicePlanDTO extends createZodDto(
  SubscriptionWithQosInstanceServicePlanResSchema
) {}

export class GetSubscriptionesResDTO extends createZodDto(GetSubscriptionesResSchema) {}

export class CreateSubscriptionBodyDTO extends createZodDto(
  CreateSubscriptionBodySchema
) {}

export class UpdateSubscriptionBodyDTO extends createZodDto(
  UpdateSubscriptionBodySchema
) {}
