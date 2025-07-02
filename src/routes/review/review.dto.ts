import { createZodDto } from 'nestjs-zod'
import {
  AdminResponseReviewBodySchema,
  CreateReviewBodySchema,
  GetReviewDetailResSchema,
  GetReviewDetailResWithFullSchema,
  GetReviewesResSchema,
  GetReviewParamsSchema,
  GetReviewQuerySchema,
  UpdateReviewBodySchema
} from './review.model'

export class CreateReviewBodyDTO extends createZodDto(CreateReviewBodySchema) {}

export class UpdateReviewBodyDTO extends createZodDto(UpdateReviewBodySchema) {}

export class AdminResponseReviewBodyDTO extends createZodDto(
  AdminResponseReviewBodySchema
) {}

export class GetReviewParamsDTO extends createZodDto(GetReviewParamsSchema) {}

export class GetReviewQueryDTO extends createZodDto(GetReviewQuerySchema) {}

export class GetReviewDetailResDTO extends createZodDto(GetReviewDetailResSchema) {}

export class GetReviewDetailResWithfullDTO extends createZodDto(
  GetReviewDetailResWithFullSchema
) {}

export class GetReviewesResDTO extends createZodDto(GetReviewesResSchema) {}
