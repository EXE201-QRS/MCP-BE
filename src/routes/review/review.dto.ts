import { createZodDto } from 'nestjs-zod'
import {
  CreateReviewBodySchema,
  GetReviewDetailResSchema,
  GetReviewDetailResWithFullSchema,
  GetReviewesResSchema,
  GetReviewParamsSchema,
  UpdateReviewBodySchema
} from './review.model'

export class CreateReviewBodyDTO extends createZodDto(CreateReviewBodySchema) {}

export class UpdateReviewBodyDTO extends createZodDto(UpdateReviewBodySchema) {}

export class GetReviewParamsDTO extends createZodDto(GetReviewParamsSchema) {}

export class GetReviewDetailResDTO extends createZodDto(GetReviewDetailResSchema) {}

export class GetReviewDetailResWithfullDTO extends createZodDto(
  GetReviewDetailResWithFullSchema
) {}

export class GetReviewesResDTO extends createZodDto(GetReviewesResSchema) {}
