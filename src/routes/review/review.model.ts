import { REVIEW_MESSAGE } from '@/common/constants/message'
import { ReviewType } from '@/common/constants/review.constant'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { z } from 'zod'

export const ReviewSchema = z
  .object({
    id: z.number(),
    customerFormsId: checkIdSchema(REVIEW_MESSAGE.CUSTOMER_FORM_ID_IS_INVALID),
    comment: z.string().trim().min(1).max(500),
    type: z.enum([ReviewType.SERVICE, ReviewType.SERVER]).default(ReviewType.SERVICE),
    rating: z.number().int().min(1).max(5).default(0),

    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict()

//list
export const GetReviewsResSchema = z.object({
  data: z.array(ReviewSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetReviewParamsSchema = z
  .object({
    reviewId: checkIdSchema(REVIEW_MESSAGE.ID_IS_INVALID)
  })
  .strict()

export const GetReviewDetailResSchema = z.object({
  data: ReviewSchema,
  message: z.string()
})

export const CreateReviewBodySchema = ReviewSchema.pick({
  customerFormsId: true,
  comment: true,
  type: true,
  rating: true
}).strict()

export const UpdateReviewBodySchema = CreateReviewBodySchema

export type ReviewType = z.infer<typeof ReviewSchema>
export type GetReviewsResType = z.infer<typeof GetReviewsResSchema>
export type GetReviewParamsType = z.infer<typeof GetReviewParamsSchema>
export type GetReviewDetailResType = z.infer<typeof GetReviewDetailResSchema>
export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>
export type UpdateReviewBodyType = z.infer<typeof UpdateReviewBodySchema>
