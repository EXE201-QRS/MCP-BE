import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import {
  CreateReviewBodyType,
  GetReviewesResType,
  ReviewType,
  UpdateReviewBodyType
} from 'src/routes/review/review.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ReviewRepo {
  constructor(private prismaService: PrismaService) {}

  create({
    createdById,
    data
  }: {
    createdById: number | null
    data: CreateReviewBodyType
  }): Promise<ReviewType> {
    return this.prismaService.review.create({
      data: {
        ...data,
        createdById
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
        responsedAt: data.adminResponse ? new Date() : null,
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

  async list(pagination: PaginationQueryType): Promise<GetReviewesResType> {
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
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          subscription: {
            select: {
              id: true,
              restaurantName: true,
              restaurantAddress: true,
              restaurantPhone: true,
              restaurantType: true,
              servicePlanId: true
            }
          },
          responsedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
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

  findWithFullById(id: number): Promise<ReviewType | null> {
    return this.prismaService.review.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        subscription: {
          select: {
            id: true,
            restaurantName: true,
            restaurantAddress: true,
            restaurantPhone: true,
            restaurantType: true,
            servicePlanId: true
          }
        },
        responsedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })
  }
}
