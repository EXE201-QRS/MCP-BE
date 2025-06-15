import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'

import { FormStatus } from '@prisma/client'
import { PrismaService } from 'src/shared/services/prisma.service'
import { GetCustomerFormsResDTO } from './customer-form.dto'
import {
  CreateCustomerFormBodyType,
  CustomerFormType,
  UpdateCustomerFormBodyType
} from './customer-form.model'

@Injectable()
export class CustomerFormRepo {
  constructor(private prismaService: PrismaService) {}

  create({ data }: { data: CreateCustomerFormBodyType }): Promise<CustomerFormType> {
    return this.prismaService.customerForm.create({
      data: {
        ...data,
        status: FormStatus.PENDING
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
    data: UpdateCustomerFormBodyType
  }): Promise<CustomerFormType> {
    return this.prismaService.customerForm.update({
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
  ): Promise<CustomerFormType> {
    return isHard
      ? this.prismaService.customerForm.delete({
          where: {
            id
          }
        })
      : this.prismaService.customerForm.update({
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

  async list(pagination: PaginationQueryType): Promise<GetCustomerFormsResDTO> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.customerForm.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.customerForm.findMany({
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

  findById(id: number): Promise<CustomerFormType | null> {
    return this.prismaService.customerForm.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }
}
