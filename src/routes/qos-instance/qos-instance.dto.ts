import { createZodDto } from 'nestjs-zod'
import {
  CreateQosInstanceBodySchema,
  GetQosInstanceDetailResSchema,
  GetQosInstanceDetailResWithFullSchema,
  GetQosInstanceesResSchema,
  GetQosInstanceParamsSchema,
  UpdateQosInstanceBodySchema
} from './qos-instance.model'

export class CreateQosInstanceBodyDTO extends createZodDto(CreateQosInstanceBodySchema) {}

export class UpdateQosInstanceBodyDTO extends createZodDto(UpdateQosInstanceBodySchema) {}

export class GetQosInstanceParamsDTO extends createZodDto(GetQosInstanceParamsSchema) {}

export class GetQosInstanceDetailResDTO extends createZodDto(
  GetQosInstanceDetailResSchema
) {}

export class GetQosInstanceDetailResWithfullDTO extends createZodDto(
  GetQosInstanceDetailResWithFullSchema
) {}

export class GetQosInstanceesResDTO extends createZodDto(GetQosInstanceesResSchema) {}
