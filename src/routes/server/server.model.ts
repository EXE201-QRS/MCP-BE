import { SERVER_MESSAGE } from '@/common/constants/message'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { ServerStatus } from '@prisma/client'
import { z } from 'zod'

export const ServerSchema = z
  .object({
    id: z.number(),
    customerFormsId: checkIdSchema(SERVER_MESSAGE.CUSTOMER_FORM_ID_IS_INVALID),
    frontEndUrl: z.string().trim().max(500).nullable().default(''),
    backEndUrl: z.string().trim().max(500).nullable().default(''),
    databaseUrl: z.string().trim().max(500).nullable().default(''),
    statusFrontEnd: z
      .enum([
        ServerStatus.ACTIVE,
        ServerStatus.MAINTENANCE,
        ServerStatus.SUSPENDED,
        ServerStatus.UNINITIALIZED
      ])
      .default(ServerStatus.UNINITIALIZED),
    statusBackEnd: z
      .enum([
        ServerStatus.ACTIVE,
        ServerStatus.MAINTENANCE,
        ServerStatus.SUSPENDED,
        ServerStatus.UNINITIALIZED
      ])
      .default(ServerStatus.UNINITIALIZED),
    statusDatabase: z
      .enum([
        ServerStatus.ACTIVE,
        ServerStatus.MAINTENANCE,
        ServerStatus.SUSPENDED,
        ServerStatus.UNINITIALIZED
      ])
      .default(ServerStatus.UNINITIALIZED),

    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict()

//list
export const GetServersResSchema = z.object({
  data: z.array(ServerSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetServerParamsSchema = z
  .object({
    serverId: checkIdSchema(SERVER_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetServerDetailResSchema = z.object({
  data: ServerSchema,
  message: z.string()
})

export const CreateServerBodySchema = ServerSchema.pick({
  customerFormsId: true,
  frontEndUrl: true,
  backEndUrl: true,
  databaseUrl: true,
  statusFrontEnd: true,
  statusBackEnd: true,
  statusDatabase: true
}).strict()

export const UpdateServerBodySchema = CreateServerBodySchema

export type ServerType = z.infer<typeof ServerSchema>
export type GetServersResType = z.infer<typeof GetServersResSchema>
export type GetServerParamsType = z.infer<typeof GetServerParamsSchema>
export type GetServerDetailResType = z.infer<typeof GetServerDetailResSchema>
export type CreateServerBodyType = z.infer<typeof CreateServerBodySchema>
export type UpdateServerBodyType = z.infer<typeof UpdateServerBodySchema>
