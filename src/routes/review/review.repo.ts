import { ReviewStatus } from '@/common/constants/review.constant'
import { Injectable } from '@nestjs/common'
import {
  CreateReviewBodyType,
  GetReviewesResType,
  GetReviewQueryType,
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
    data: Partial<UpdateReviewBodyType>
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

  async list(query: GetReviewQueryType): Promise<GetReviewesResType> {
    const {
      page,
      limit,
      status,
      reviewFor,
      rating,
      userId,
      subscriptionId,
      isPublic,
      search
    } = query
    const skip = (page - 1) * limit
    const take = limit

    const where: any = {
      deletedAt: null
    }

    if (status) where.status = status
    if (reviewFor) where.reviewFor = reviewFor
    if (rating) where.rating = rating
    if (userId) where.userId = userId
    if (subscriptionId) where.subscriptionId = subscriptionId
    if (isPublic !== undefined) where.isPublic = isPublic
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { adminResponse: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [totalItems, data] = await Promise.all([
      this.prismaService.review.count({ where }),
      this.prismaService.review.findMany({
        where,
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
        take,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async getPublicReviews(query: GetReviewQueryType): Promise<GetReviewesResType> {
    return this.list({
      ...query,
      isPublic: true,
      status: ReviewStatus.APPROVED
    })
  }

  async getPendingReviews(query: GetReviewQueryType): Promise<GetReviewesResType> {
    return this.list({
      ...query,
      status: ReviewStatus.PENDING
    })
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
