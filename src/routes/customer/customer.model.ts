import { CUSTOMER_MESSAGE } from '@/common/constants/message'
import { UserSchema } from '@/shared/models/shared-user.model'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { CustomerStatus } from '@prisma/client'
import { z } from 'zod'

export const CustomerSchema = z.object({
  id: z.number(),
  userId: z.number().min(0, CUSTOMER_MESSAGE.ID_IS_INVALID),
  status: z
    .enum([
      CustomerStatus.ACTIVE,
      CustomerStatus.INACTIVE,
      CustomerStatus.PENDING_VERIFICATION,
      CustomerStatus.SUSPENDED
    ])
    .default(CustomerStatus.INACTIVE),
  restaurantName: z.string().min(1).nullable(),
  restaurantAddress: z.string().nullable(),
  restaurantPhone: z.string().min(9, CUSTOMER_MESSAGE.PHONE_IS_INVALID).nullable(),
  restaurantType: z.string().min(1).nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CustomerWithUserSchema = CustomerSchema.extend({
  user: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    avatar: true,
    roleName: true
  })
})

//GET
export const GetCustomeresResSchema = z.object({
  data: z.array(CustomerWithUserSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetCustomerParamsSchema = z
  .object({
    customerId: checkIdSchema(CUSTOMER_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetCustomerDetailResSchema = z.object({
  data: CustomerSchema,
  message: z.string()
})

export const GetCustomerDetailResWithUserSchema = z.object({
  data: CustomerWithUserSchema,
  message: z.string()
})

export const CreateCustomerBodySchema = CustomerSchema.pick({
  userId: true
})
  .strict()
  .extend({
    restaurantName: z
      .string()
      .min(1, CUSTOMER_MESSAGE.RESTAURANT_NAME_IS_REQUIRED)
      .optional(),
    restaurantAddress: z.string().nullable().optional(),
    restaurantPhone: z
      .string()
      .min(9, CUSTOMER_MESSAGE.PHONE_IS_INVALID)
      .max(15, CUSTOMER_MESSAGE.PHONE_IS_INVALID)
      .nullable()
      .optional(),
    restaurantType: z
      .string()
      .min(1, CUSTOMER_MESSAGE.RESTAURANT_TYPE_IS_REQUIRED)
      .nullable()
      .optional()
  })
export const UpdateCustomerBodySchema = CreateCustomerBodySchema

//types
export type CustomerType = z.infer<typeof CustomerSchema>
export type CreateCustomerBodyType = z.infer<typeof CreateCustomerBodySchema>
export type UpdateCustomerBodyType = z.infer<typeof UpdateCustomerBodySchema>
export type GetCustomerParamsType = z.infer<typeof GetCustomerParamsSchema>
export type GetCustomerDetailResType = z.infer<typeof GetCustomerDetailResSchema>
export type GetCustomerDetailResWithUserType = z.infer<
  typeof GetCustomerDetailResWithUserSchema
>
export type GetCustomeresResType = z.infer<typeof GetCustomeresResSchema>
