import { SERVICE_PLAN_MESSAGE } from '@/common/constants/message'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { z } from 'zod'

export const ServicePlanSchema = z
  .object({
    id: z.number(),
    name: z.string().trim().min(1, SERVICE_PLAN_MESSAGE.NAME_IS_REQUIRED).max(500),
    description: z.string().trim().max(1000).nullable(),
    price: z.number().min(0, SERVICE_PLAN_MESSAGE.PRICE_IS_INVALID),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict()

//list categories
export const GetServicePlansResSchema = z.object({
  data: z.array(ServicePlanSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetServicePlanParamsSchema = z
  .object({
    servicePlanId: checkIdSchema(SERVICE_PLAN_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetServicePlanDetailResSchema = z.object({
  data: ServicePlanSchema,
  message: z.string()
})

export const CreateServicePlanBodySchema = ServicePlanSchema.pick({
  name: true,
  description: true,
  price: true
}).strict()

export const UpdateServicePlanBodySchema = CreateServicePlanBodySchema

export type ServicePlanType = z.infer<typeof ServicePlanSchema>
export type GetServicePlansResType = z.infer<typeof GetServicePlansResSchema>
export type GetServicePlanParamsType = z.infer<typeof GetServicePlanParamsSchema>
export type GetServicePlanDetailResType = z.infer<typeof GetServicePlanDetailResSchema>
export type CreateServicePlanBodyType = z.infer<typeof CreateServicePlanBodySchema>
export type UpdateServicePlanBodyType = z.infer<typeof UpdateServicePlanBodySchema>
