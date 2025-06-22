import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
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

  async list(pagination: PaginationQueryType): Promise<GetSubscriptionesResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.subscription.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.subscription.findMany({
        where: {
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
}
