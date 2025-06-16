import { REVIEW_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { CreateReviewBodyType, UpdateReviewBodyType } from './review.model'
import { ReviewRepo } from './review.repo'

@Injectable()
export class ReviewService {
  constructor(private reviewRepo: ReviewRepo) {}

  async list(pagination: PaginationQueryType) {
    const data = await this.reviewRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const review = await this.reviewRepo.findById(id)
    if (!review) {
      throw NotFoundRecordException
    }
    return {
      data: review,
      message: REVIEW_MESSAGE.GET_DETAIL_SUCCESSFUL
    }
  }

  async create({ data }: { data: CreateReviewBodyType }) {
    try {
      const result = await this.reviewRepo.create({
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
        message: REVIEW_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }

      throw error
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
