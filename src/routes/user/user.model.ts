import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

//POST
export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  password: true,
  roleName: true
}).strict()

export const CreateUserResSchema = z.object({
  data: UserSchema.omit({ password: true }),
  message: z.string()
})

//PUT
export const UpdateUserBodySchema = CreateUserBodySchema
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
