import { createZodDto } from 'nestjs-zod'
import {
  CreateReviewBodySchema,
  GetReviewDetailResSchema,
  GetReviewParamsSchema,
  GetReviewsResSchema,
  UpdateReviewBodySchema
} from './review.model'

export class GetReviewDetailResDTO extends createZodDto(GetReviewDetailResSchema) {}

export class GetReviewParamsDTO extends createZodDto(GetReviewParamsSchema) {}

export class GetReviewsResDTO extends createZodDto(GetReviewsResSchema) {}

export class CreateReviewBodyDTO extends createZodDto(CreateReviewBodySchema) {}

export class UpdateReviewBodyDTO extends createZodDto(UpdateReviewBodySchema) {}
