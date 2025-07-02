import { REVIEW_MESSAGE } from '@/common/constants/message'
import { ReviewFor, ReviewStatus } from '@/common/constants/review.constant'
import { UserSchema } from '@/shared/models/shared-user.model'
import { checkIdSchema } from '@/shared/utils/id.validation'
import { z } from 'zod'
import { SubscriptionSchema } from '../subscription/subscription.model'

export const ReviewSchema = z.object({
  id: z.number(),
  userId: checkIdSchema(REVIEW_MESSAGE.USER_ID_IS_INVALID),
  subscriptionId: checkIdSchema(REVIEW_MESSAGE.SUBSCRIPTION_ID_IS_INVALID),

  rating: z.number().int().min(1).max(5),
  content: z.string().min(1, REVIEW_MESSAGE.CONTENT_IS_REQUIRED),
  status: z
    .enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED])
    .default(ReviewStatus.PENDING),
  isPublic: z.boolean().default(false),
  reviewFor: z.enum([ReviewFor.PLATFORM, ReviewFor.SERVICE]).default(ReviewFor.SERVICE),

  adminResponse: z.string().nullable(),
  responsedAt: z.date().nullable(),
  responsedById: z.number().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const ReviewWithFullSchema = ReviewSchema.extend({
  user: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    avatar: true
  }),
  subscription: SubscriptionSchema.pick({
    id: true,
    restaurantName: true,
    restaurantAddress: true,
    restaurantPhone: true,
    restaurantType: true,
    servicePlanId: true
  }),
  responsedBy: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    avatar: true
  }).nullable()
})

//GET
export const GetReviewesResSchema = z.object({
  data: z.array(ReviewWithFullSchema),
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

export const GetReviewDetailResWithFullSchema = z.object({
  data: ReviewWithFullSchema,
  message: z.string()
})

export const CreateReviewBodySchema = ReviewSchema.pick({
  userId: true,
  subscriptionId: true,
  rating: true,
  content: true,
  reviewFor: true
}).strict()

export const UpdateReviewBodySchema = CreateReviewBodySchema.extend({
  status: ReviewSchema.shape.status.optional(),
  isPublic: ReviewSchema.shape.isPublic.optional(),
  adminResponse: ReviewSchema.shape.adminResponse.optional(),
  responsedById: ReviewSchema.shape.responsedById.optional()
})

// Admin response schema
export const AdminResponseReviewBodySchema = z
  .object({
    adminResponse: z.string().min(1, REVIEW_MESSAGE.ADMIN_RESPONSE_IS_REQUIRED),
    status: z.enum([ReviewStatus.APPROVED, ReviewStatus.REJECTED]),
    isPublic: z.boolean().optional()
  })
  .strict()

// Query schema for filtering
export const GetReviewQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z
      .enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED])
      .optional(),
    reviewFor: z.enum([ReviewFor.PLATFORM, ReviewFor.SERVICE]).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    userId: z.coerce.number().int().positive().optional(),
    subscriptionId: z.coerce.number().int().positive().optional(),
    isPublic: z.coerce.boolean().optional(),
    search: z.string().optional() // Search in content
  })
  .strict()

//types
export type ReviewType = z.infer<typeof ReviewSchema>
export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>
export type UpdateReviewBodyType = z.infer<typeof UpdateReviewBodySchema>
export type AdminResponseReviewBodyType = z.infer<typeof AdminResponseReviewBodySchema>
export type GetReviewParamsType = z.infer<typeof GetReviewParamsSchema>
export type GetReviewQueryType = z.infer<typeof GetReviewQuerySchema>
export type GetReviewDetailResType = z.infer<typeof GetReviewDetailResSchema>
export type GetReviewDetailResWithFullType = z.infer<
  typeof GetReviewDetailResWithFullSchema
>
export type GetReviewesResType = z.infer<typeof GetReviewesResSchema>
