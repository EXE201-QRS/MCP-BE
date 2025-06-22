import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CreateServicePlanBodyType,
  GetServicePlansResType,
  ServicePlanType,
  UpdateServicePlanBodyType
} from './service-plan.model'

@Injectable()
export class ServicePlanRepo {
  constructor(private prismaService: PrismaService) {}

  create({
    createdById,
    data
  }: {
    createdById: number | null
    data: CreateServicePlanBodyType
  }): Promise<ServicePlanType> {
    return this.prismaService.servicePlan.create({
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
    data: UpdateServicePlanBodyType
  }): Promise<ServicePlanType> {
    return this.prismaService.servicePlan.update({
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
  ): Promise<ServicePlanType> {
    return isHard
      ? this.prismaService.servicePlan.delete({
          where: {
            id
          }
        })
      : this.prismaService.servicePlan.update({
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

  async list(pagination: PaginationQueryType): Promise<GetServicePlansResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.servicePlan.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.servicePlan.findMany({
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

  findById(id: number): Promise<ServicePlanType | null> {
    return this.prismaService.servicePlan.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }
}
