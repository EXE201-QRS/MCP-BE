import { CUSTOMER_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError
} from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import {
  CustomerAlreadyExistsException,
  CustomerNotFoundException
} from './customer.error'
import { CreateCustomerBodyType, UpdateCustomerBodyType } from './customer.model'
import { CustomerRepo } from './customer.repo'

@Injectable()
export class CustomerService {
  constructor(private customerRepo: CustomerRepo) {}

  async create({ data }: { data: CreateCustomerBodyType }) {
    try {
      const result = await this.customerRepo.create({
        data
      })
      return {
        data: result,
        message: 'Tạo món ăn thành công'
      }
    } catch (error) {
      // Hanlde not found fn
      if (isForeignKeyConstraintPrismaError(error)) {
        throw CustomerAlreadyExistsException
      }
      // Handle unique constraint error
      if (isUniqueConstraintPrismaError(error)) {
        throw CustomerAlreadyExistsException
      }
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById
  }: {
    id: number
    data: UpdateCustomerBodyType
    updatedById: number
  }) {
    try {
      const customer = await this.customerRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: customer,
        message: 'Cập nhật món ăn thành công'
      }
    } catch (error) {
      // Handle not found pn (id)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      // Hanlde not found fn (categoryIdcategoryId)
      if (isForeignKeyConstraintPrismaError(error)) {
        throw CustomerNotFoundException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw CustomerAlreadyExistsException
      }
      throw error
    }
  }

  async list(pagination: PaginationQueryType) {
    const data = await this.customerRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const customer = await this.customerRepo.findWithCategoryById(id)
    if (!customer) {
      throw NotFoundRecordException
    }
    return {
      data: customer,
      message: CUSTOMER_MESSAGE.GET_SUCCESS
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.customerRepo.delete({
        id,
        deletedById
      })
      return {
        message: CUSTOMER_MESSAGE.DELETED_SUCCESS
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
