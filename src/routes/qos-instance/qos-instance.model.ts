import { UserSchema } from '@/shared/models/shared-user.model'
import { checkIdSchema } from '@/shared/utils/id.validation'

import { QOS_INSTANCE_MESSAGE } from '@/common/constants/message'
import { QosInstanceStatus } from '@/common/constants/qos-instance.constant'
import { z } from 'zod'
import { SubscriptionSchema } from '../subscription/subscription.model'

export const QosInstanceSchema = z.object({
  id: z.number(),
  userId: checkIdSchema(QOS_INSTANCE_MESSAGE.USER_ID_IS_INVALID),
  subscriptionId: checkIdSchema(QOS_INSTANCE_MESSAGE.SUBSCRIPTION_ID_IS_INVALID),
  dbName: z.string().nullable(),
  statusDb: z
    .enum([
      QosInstanceStatus.ACTIVE,
      QosInstanceStatus.DEPLOYING,
      QosInstanceStatus.ERROR,
      QosInstanceStatus.INACTIVE,
      QosInstanceStatus.MAINTENANCE
    ])
    .default(QosInstanceStatus.INACTIVE),
  frontEndUrl: z.string().url().nullable(),
  statusFE: z
    .enum([
      QosInstanceStatus.ACTIVE,
      QosInstanceStatus.DEPLOYING,
      QosInstanceStatus.ERROR,
      QosInstanceStatus.INACTIVE,
      QosInstanceStatus.MAINTENANCE
    ])
    .default(QosInstanceStatus.INACTIVE),
  backEndUrl: z.string().url().nullable(),
  statusBE: z
    .enum([
      QosInstanceStatus.ACTIVE,
      QosInstanceStatus.DEPLOYING,
      QosInstanceStatus.ERROR,
      QosInstanceStatus.INACTIVE,
      QosInstanceStatus.MAINTENANCE
    ])
    .default(QosInstanceStatus.INACTIVE),
  serverInfo: z.string().nullable(),
  dbSize: z.number().min(0).nullable(),
  lastBackup: z.date().nullable(),
  lastPing: z.date().nullable(),
  responseTime: z.number().min(0).nullable(),
  uptime: z.number().min(0).nullable(),
  version: z.string().nullable(),
  deployedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const QosInstanceWithFullSchema = QosInstanceSchema.extend({
  user: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    avatar: true
  }),
  subscription: SubscriptionSchema.pick({
    id: true,
    restaurantName: true,
    restaurantAddress: true,
    restaurantPhone: true,
    restaurantType: true,
    servicePlanId: true
  })
})

//GET
export const GetQosInstanceesResSchema = z.object({
  data: z.array(QosInstanceWithFullSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetQosInstanceParamsSchema = z
  .object({
    qosInstanceId: checkIdSchema(QOS_INSTANCE_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetQosInstanceDetailResSchema = z.object({
  data: QosInstanceSchema,
  message: z.string()
})

export const GetQosInstanceDetailResWithFullSchema = z.object({
  data: QosInstanceWithFullSchema,
  message: z.string()
})

export const CreateQosInstanceBodySchema = QosInstanceSchema.pick({
  userId: true,
  subscriptionId: true
})
  .strict()
  .extend({
    dbName: QosInstanceSchema.shape.dbName.optional(),
    frontEndUrl: QosInstanceSchema.shape.frontEndUrl.optional(),
    backEndUrl: QosInstanceSchema.shape.backEndUrl.optional(),
    statusDb: QosInstanceSchema.shape.statusDb
      .optional()
      .default(QosInstanceStatus.ACTIVE),
    statusFE: QosInstanceSchema.shape.statusFE
      .optional()
      .default(QosInstanceStatus.ACTIVE),
    statusBE: QosInstanceSchema.shape.statusBE
      .optional()
      .default(QosInstanceStatus.ACTIVE),
    serverInfo: QosInstanceSchema.shape.serverInfo.optional(),
    dbSize: QosInstanceSchema.shape.dbSize.optional(),
    lastBackup: QosInstanceSchema.shape.lastBackup.optional(),
    lastPing: QosInstanceSchema.shape.lastPing.optional(),
    responseTime: QosInstanceSchema.shape.responseTime.optional(),
    uptime: QosInstanceSchema.shape.uptime.optional(),
    version: QosInstanceSchema.shape.version.optional()
  })

export const UpdateQosInstanceBodySchema = CreateQosInstanceBodySchema

//types
export type QosInstanceType = z.infer<typeof QosInstanceSchema>
export type CreateQosInstanceBodyType = z.infer<typeof CreateQosInstanceBodySchema>
export type UpdateQosInstanceBodyType = z.infer<typeof UpdateQosInstanceBodySchema>
export type GetQosInstanceParamsType = z.infer<typeof GetQosInstanceParamsSchema>
export type GetQosInstanceDetailResType = z.infer<typeof GetQosInstanceDetailResSchema>
export type GetQosInstanceDetailResWithFullType = z.infer<
  typeof GetQosInstanceDetailResWithFullSchema
>
export type GetQosInstanceesResType = z.infer<typeof GetQosInstanceesResSchema>
