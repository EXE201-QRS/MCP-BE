import { REVIEW_MESSAGE, SUBSCRIPTION_MESSAGE } from '@/common/constants/message'
import { SubscriptionStatus } from '@/common/constants/subscription.constant'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { SubscriptionRepo } from '../subscription/subscription.repo'
import { SubscriptionHasNotPaidToReview, UnAuthorizatedToReview } from './review.error'
import { CreateReviewBodyType, UpdateReviewBodyType } from './review.model'
import { ReviewRepo } from './review.repo'

@Injectable()
export class ReviewService {
  constructor(
    private reviewRepo: ReviewRepo,
    private readonly subsRepo: SubscriptionRepo
  ) {}

  async create({
    data,
    createdById
  }: {
    data: CreateReviewBodyType
    createdById: number
  }) {
    try {
      // check subs đã thanh toán chưa -> rồi mới được review
      const isSubs = await this.subsRepo.findById(data.subscriptionId)
      if (!isSubs || isSubs.status === SubscriptionStatus.PENDING) {
        throw SubscriptionHasNotPaidToReview
      }
      if (isSubs.userId !== createdById) {
        throw UnAuthorizatedToReview
      }
      const result = await this.reviewRepo.create({
        createdById,
        data
      })
      return {
        data: result,
        message: REVIEW_MESSAGE.CREATED_SUCCESSFUL
      }
    } catch (error) {
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById
  }: {
    id: number
    data: UpdateReviewBodyType
    updatedById: number
  }) {
    try {
      const review = await this.reviewRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: review,
        message: SUBSCRIPTION_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      // Handle not found pn (id)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async list(pagination: PaginationQueryType) {
    const data = await this.reviewRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const review = await this.reviewRepo.findWithFullById(id)
    if (!review) {
      throw NotFoundRecordException
    }
    return {
      data: review,
      message: REVIEW_MESSAGE.GET_DETAIL_SUCCESSFUL
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.reviewRepo.delete({
        id,
        deletedById
      })
      return {
        message: REVIEW_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
