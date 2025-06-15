import { CUSTOMER_FORM_MESSAGE } from '@/common/constants/message'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { FormStatus } from '@prisma/client'
import { z } from 'zod'

export const CustomerFormSchema = z
  .object({
    id: z.number(),
    servicePlanId: checkIdSchema(CUSTOMER_FORM_MESSAGE.SERVICE_PLAN_ID_IS_INVALID),
    name: z.string().trim().min(1, CUSTOMER_FORM_MESSAGE.NAME_IS_REQUIRED).max(500),
    phone: z.string().trim().max(15),
    email: z.string().trim().email().max(255),
    address: z.string().trim().max(500),
    businessName: z.string().trim().max(500),
    note: z.string().trim().max(1000).nullable().default(null),
    status: z.enum([
      FormStatus.PENDING,
      FormStatus.PROCESSING,
      FormStatus.PAID,
      FormStatus.COMPLETED,
      FormStatus.REJECTED
    ]),
    startDate: z.date().nullable().default(null),
    endDate: z.date().nullable().default(null),

    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict()

//list
export const GetCustomerFormsResSchema = z.object({
  data: z.array(CustomerFormSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetCustomerFormParamsSchema = z
  .object({
    customerFormId: checkIdSchema(CUSTOMER_FORM_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetCustomerFormDetailResSchema = z.object({
  data: CustomerFormSchema,
  message: z.string()
})

export const CreateCustomerFormBodySchema = CustomerFormSchema.pick({
  name: true,
  phone: true,
  email: true,
  address: true,
  businessName: true,
  note: true,
  servicePlanId: true,
  status: true
}).strict()

export const UpdateCustomerFormBodySchema = CreateCustomerFormBodySchema.extend({
  startDate: z.date().nullable().default(null),
  endDate: z.date().nullable().default(null)
})

export type CustomerFormType = z.infer<typeof CustomerFormSchema>
export type GetCustomerFormsResType = z.infer<typeof GetCustomerFormsResSchema>
export type GetCustomerFormParamsType = z.infer<typeof GetCustomerFormParamsSchema>
export type GetCustomerFormDetailResType = z.infer<typeof GetCustomerFormDetailResSchema>
export type CreateCustomerFormBodyType = z.infer<typeof CreateCustomerFormBodySchema>
export type UpdateCustomerFormBodyType = z.infer<typeof UpdateCustomerFormBodySchema>
