import { createZodDto } from 'nestjs-zod'
import {
  CreateServerBodySchema,
  GetServerDetailResSchema,
  GetServerParamsSchema,
  GetServersResSchema,
  UpdateServerBodySchema
} from './server.model'

export class GetServerDetailResDTO extends createZodDto(GetServerDetailResSchema) {}

export class GetServerParamsDTO extends createZodDto(GetServerParamsSchema) {}

export class GetServersResDTO extends createZodDto(GetServersResSchema) {}

export class CreateServerBodyDTO extends createZodDto(CreateServerBodySchema) {}

export class UpdateServerBodyDTO extends createZodDto(UpdateServerBodySchema) {}
