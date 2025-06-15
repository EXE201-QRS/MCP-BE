import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/shared/services/prisma.service'
import { GetReviewsResDTO } from './review.dto'
import { CreateReviewBodyType, ReviewType, UpdateReviewBodyType } from './review.model'

@Injectable()
export class ReviewRepo {
  constructor(private prismaService: PrismaService) {}

  create({ data }: { data: CreateReviewBodyType }): Promise<ReviewType> {
    return this.prismaService.review.create({
      data: {
        ...data
      }
    })
  }

  update({
    id,
    updatedById,
    data
  }: {
    id: number
    updatedById: number
    data: UpdateReviewBodyType
  }): Promise<ReviewType> {
    return this.prismaService.review.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...data,
        updatedById
      }
    })
  }

  delete(
    {
      id,
      deletedById
    }: {
      id: number
      deletedById: number
    },
    isHard?: boolean
  ): Promise<ReviewType> {
    return isHard
      ? this.prismaService.review.delete({
          where: {
            id
          }
        })
      : this.prismaService.review.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date(),
            deletedById
          }
        })
  }

  async list(pagination: PaginationQueryType): Promise<GetReviewsResDTO> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.review.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.review.findMany({
        where: {
          deletedAt: null
        },
        skip,
        take
      })
    ])
    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit)
    }
  }

  findById(id: number): Promise<ReviewType | null> {
    return this.prismaService.review.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }
}
