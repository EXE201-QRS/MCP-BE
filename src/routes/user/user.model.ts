import { Role } from '@/common/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

//POST
export const CreateUserBodySchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
    phoneNumber: z.string().min(9).max(15).optional(),
    avatar: z.string().optional(),
    password: z.string().min(6).max(100),
    roleName: z.enum([Role.ADMIN_SYSTEM, Role.CUSTOMER]).default(Role.CUSTOMER)
  })
  .strict()

export const CreateUserResSchema = z.object({
  data: UserSchema.omit({ password: true }),
  message: z.string()
})

//PUT
export const UpdateUserBodySchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().min(9).max(15).optional(),
    avatar: z.string().optional(),
    password: z.string().min(6).max(100).optional(),
    roleName: z.enum([Role.ADMIN_SYSTEM, Role.CUSTOMER]).optional()
  })
  .strict()
export const UpdateUserResSchema = CreateUserResSchema

//GET
export const GetUsersResSchema = z.object({
  data: z.array(UserSchema.omit({ password: true })),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetUserParamsSchema = z
  .object({
    userId: z.coerce.number().int().positive()
  })
  .strict()

//types
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type CreateUserResType = z.infer<typeof CreateUserResSchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>
export type UserType = z.infer<typeof UserSchema>
