import { SUBSCRIPTION_MESSAGE } from '@/common/constants/message'
import {
  DurationDays,
  SubscriptionStatus
} from '@/common/constants/subscription.constant'
import { UserSchema } from '@/shared/models/shared-user.model'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { z } from 'zod'
import { ServicePlanSchema } from '../service-plan/service-plan.model'

export const SubscriptionSchema = z.object({
  id: z.number(),
  userId: checkIdSchema(SUBSCRIPTION_MESSAGE.USER_ID_IS_INVALID),
  restaurantName: z.string().min(1, SUBSCRIPTION_MESSAGE.RESTAURANT_NAME_IS_REQUIRED),
  restaurantAddress: z
    .string()
    .min(1, SUBSCRIPTION_MESSAGE.RESTAURANT_ADDRESS_IS_REQUIRED),
  restaurantPhone: z.string().min(1, SUBSCRIPTION_MESSAGE.RESTAURANT_PHONE_IS_REQUIRED),
  restaurantType: z.string().min(1, SUBSCRIPTION_MESSAGE.RESTAURANT_TYPE_IS_REQUIRED),
  description: z.string().nullable(),
  servicePlanId: checkIdSchema(SUBSCRIPTION_MESSAGE.SERVICE_PLAN_ID_IS_INVALID),
  durationDays: z.enum([
    DurationDays.ONE_MONTH,
    DurationDays.THREE_MONTHS,
    DurationDays.SIX_MONTHS
  ]),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  status: z
    .enum([
      SubscriptionStatus.PENDING,
      SubscriptionStatus.PAID,
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.EXPIRED,
      SubscriptionStatus.CANCELLED
    ])
    .default(SubscriptionStatus.PENDING),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const SubscriptionWithUserServicePlanSchema = SubscriptionSchema.extend({
  user: UserSchema.pick({
    id: true,
    name: true,
    email: true
  }),
  servicePlan: ServicePlanSchema.pick({
    id: true,
    name: true,
    price: true,
    description: true
  })
})

export const SubscriptionWithQosInstanceServicePlanSchema = SubscriptionSchema.extend({
  qosInstance: z
    .object({
      id: z.number(),
      backEndUrl: z.string().url().nullable()
    })
    .nullable(),
  servicePlan: ServicePlanSchema.pick({
    id: true,
    name: true,
    price: true,
    description: true
  })
})

export const SubscriptionWithQosInstanceServicePlanResSchema = z.object({
  data: z.object({
    ...SubscriptionWithQosInstanceServicePlanSchema.shape,
    healthCheck: z
      .object({
        amountUser: z.number().nullable(),
        amountTable: z.number().nullable(),
        amountOrder: z.number().nullable(),
        usedStorage: z.string().nullable()
      })
      .nullable()
  }),
  message: z.string()
})

//GET
export const GetSubscriptionesResSchema = z.object({
  data: z.array(SubscriptionWithUserServicePlanSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetSubscriptionParamsSchema = z
  .object({
    subscriptionId: checkIdSchema(SUBSCRIPTION_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetSubscriptionDetailResSchema = z.object({
  data: SubscriptionSchema,
  message: z.string()
})

export const GetSubscriptionDetailResWithUserServicePlanSchema = z.object({
  data: SubscriptionWithUserServicePlanSchema,
  message: z.string()
})

export const CreateSubscriptionBodySchema = SubscriptionSchema.pick({
  userId: true,
  restaurantName: true,
  restaurantAddress: true,
  restaurantPhone: true,
  restaurantType: true,
  description: true,
  servicePlanId: true,
  durationDays: true
}).strict()
export const UpdateSubscriptionBodySchema = CreateSubscriptionBodySchema.extend({
  startDate: SubscriptionSchema.shape.startDate.optional(),
  endDate: SubscriptionSchema.shape.endDate.optional(),
  status: SubscriptionSchema.shape.status.optional()
})

//types
export type SubscriptionType = z.infer<typeof SubscriptionSchema>
export type CreateSubscriptionBodyType = z.infer<typeof CreateSubscriptionBodySchema>
export type UpdateSubscriptionBodyType = z.infer<typeof UpdateSubscriptionBodySchema>
export type GetSubscriptionParamsType = z.infer<typeof GetSubscriptionParamsSchema>
export type GetSubscriptionDetailResType = z.infer<typeof GetSubscriptionDetailResSchema>
export type GetSubscriptionDetailResWithUserServicePlanType = z.infer<
  typeof GetSubscriptionDetailResWithUserServicePlanSchema
>
export type GetSubscriptionesResType = z.infer<typeof GetSubscriptionesResSchema>

export type SubscriptionWithQosInstanceServicePlanType = z.infer<
  typeof SubscriptionWithQosInstanceServicePlanSchema
>
