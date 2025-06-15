import { CUSTOMER_FORM_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError, mapEnumToDays } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { FormStatus } from '@prisma/client'
import { ServicePlanRepo } from '../service-plan/service-plan.repo'
import { ServicePlanNotExistsException } from './customer-form.error'
import {
  CreateCustomerFormBodyType,
  UpdateCustomerFormBodyType
} from './customer-form.model'
import { CustomerFormRepo } from './customer-form.repo'

@Injectable()
export class CustomerFormService {
  constructor(
    private customerFormRepo: CustomerFormRepo,
    private readonly servicePlanRepo: ServicePlanRepo
  ) {}

  async list(pagination: PaginationQueryType) {
    const data = await this.customerFormRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const customerForm = await this.customerFormRepo.findById(id)
    if (!customerForm) {
      throw NotFoundRecordException
    }
    return {
      data: customerForm,
      message: CUSTOMER_FORM_MESSAGE.GET_DETAIL_SUCCESSFUL
    }
  }

  async create({ data }: { data: CreateCustomerFormBodyType }) {
    try {
      const result = await this.customerFormRepo.create({
        data
      })
      return {
        data: result,
        message: CUSTOMER_FORM_MESSAGE.CREATED_SUCCESSFUL
      }
    } catch (error) {
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById
  }: {
    id: number
    data: UpdateCustomerFormBodyType
    updatedById: number
  }) {
    try {
      // check neu status completed thi update them startDate, endDate
      if (data.status === FormStatus.COMPLETED) {
        const servicePlan = await this.servicePlanRepo.findById(data.servicePlanId)
        if (!servicePlan) {
          throw ServicePlanNotExistsException
        }
        const plusTime = parseInt(mapEnumToDays(servicePlan.durationDays))
        const dateNow = new Date()
        data.startDate = dateNow
        data.endDate = new Date(dateNow.getTime() + plusTime * 24 * 60 * 60 * 1000)
      }

      const customerForm = await this.customerFormRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: customerForm,
        message: CUSTOMER_FORM_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }

      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.customerFormRepo.delete({
        id,
        deletedById
      })
      return {
        message: CUSTOMER_FORM_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
