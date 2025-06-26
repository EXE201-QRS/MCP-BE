import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CreateQosInstanceBodyType,
  GetQosInstanceesResType,
  QosInstanceType,
  UpdateQosInstanceBodyType
} from './qos-instance.model'

@Injectable()
export class QosInstanceRepo {
  constructor(private prismaService: PrismaService) {}

  create({
    createdById,
    data
  }: {
    createdById: number | null
    data: CreateQosInstanceBodyType
  }): Promise<QosInstanceType> {
    return this.prismaService.qosInstance.create({
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
    data: UpdateQosInstanceBodyType
  }): Promise<QosInstanceType> {
    return this.prismaService.qosInstance.update({
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
  ): Promise<QosInstanceType> {
    return isHard
      ? this.prismaService.qosInstance.delete({
          where: {
            id
          }
        })
      : this.prismaService.qosInstance.update({
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

  async list(pagination: PaginationQueryType): Promise<GetQosInstanceesResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.qosInstance.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.qosInstance.findMany({
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

  findById(id: number): Promise<QosInstanceType | null> {
    return this.prismaService.qosInstance.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  findWithUserSubsById(id: number): Promise<QosInstanceType | null> {
    return this.prismaService.qosInstance.findUnique({
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
        }
      }
    })
  }
}
