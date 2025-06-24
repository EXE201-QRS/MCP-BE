import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { SubscriptionStatus } from '@prisma/client'
import {
  CreateSubscriptionBodyType,
  GetSubscriptionesResType,
  SubscriptionType,
  UpdateSubscriptionBodyType
} from 'src/routes/subscription/subscription.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SubscriptionRepo {
  constructor(private prismaService: PrismaService) {}

  create({
    createdById,
    data
  }: {
    createdById: number | null
    data: CreateSubscriptionBodyType
  }): Promise<SubscriptionType> {
    return this.prismaService.subscription.create({
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
    data: UpdateSubscriptionBodyType
  }): Promise<SubscriptionType> {
    return this.prismaService.subscription.update({
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
  ): Promise<SubscriptionType> {
    return isHard
      ? this.prismaService.subscription.delete({
          where: {
            id
          }
        })
      : this.prismaService.subscription.update({
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

  async list(
    pagination: PaginationQueryType & { userId?: number }
  ): Promise<GetSubscriptionesResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    // Build where clause với userId filter
    const whereClause = {
      deletedAt: null,
      ...(pagination.userId && { userId: pagination.userId })
    }

    const [totalItems, data] = await Promise.all([
      this.prismaService.subscription.count({
        where: whereClause
      }),
      this.prismaService.subscription.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          servicePlan: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true
            }
          }
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
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

  findById(id: number): Promise<SubscriptionType | null> {
    return this.prismaService.subscription.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  findWithUserServicePlanById(id: number): Promise<SubscriptionType | null> {
    return this.prismaService.subscription.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        servicePlan: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true
          }
        }
      }
    })
  }

  isSubscriptionPaid(id): Promise<boolean> {
    return this.prismaService.subscription
      .findFirst({
        where: {
          id,
          deletedAt: null,
          status: SubscriptionStatus.PAID
        }
      })
      .then((subscription) => !!subscription)
  }
}
