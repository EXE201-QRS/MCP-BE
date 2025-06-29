import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetUserParamsSchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
  UpdateUserResSchema
} from '@/routes/user/user.model'
import { createZodDto } from 'nestjs-zod'

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUserParamsDTO extends createZodDto(GetUserParamsSchema) {}

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}

export class CreateUserResDTO extends createZodDto(CreateUserResSchema) {}

export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}

export class UpdateUserResDTO extends createZodDto(UpdateUserResSchema) {}
