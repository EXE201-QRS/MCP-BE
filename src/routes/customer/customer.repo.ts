import {
  CreateCustomerBodyType,
  CustomerType,
  GetCustomeresResType,
  UpdateCustomerBodyType
} from '@/routes/customer/customer.model'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class CustomerRepo {
  constructor(private prismaService: PrismaService) {}

  create({ data }: { data: CreateCustomerBodyType }): Promise<CustomerType> {
    return this.prismaService.customer.create({
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
    data: UpdateCustomerBodyType
  }): Promise<CustomerType> {
    return this.prismaService.customer.update({
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
  ): Promise<CustomerType> {
    return isHard
      ? this.prismaService.customer.delete({
          where: {
            id
          }
        })
      : this.prismaService.customer.update({
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

  async list(pagination: PaginationQueryType): Promise<GetCustomeresResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.customer.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.customer.findMany({
        where: {
          deletedAt: null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              avatar: true,
              roleName: true
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

  findById(id: number): Promise<CustomerType | null> {
    return this.prismaService.customer.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  findWithCategoryById(id: number): Promise<CustomerType | null> {
    return this.prismaService.customer.findUnique({
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
            phoneNumber: true,
            avatar: true,
            roleName: true
          }
        }
      }
    })
  }
}
