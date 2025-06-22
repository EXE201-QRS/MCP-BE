import { Role } from '@/common/constants/auth.constant'
import { SERVICE_PLAN_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { UnauthorizedAccessException } from '../auth/auth.error'
import { ServicePlanAlreadyExistsException } from './service-plan.error'
import {
  CreateServicePlanBodyType,
  UpdateServicePlanBodyType
} from './service-plan.model'
import { ServicePlanRepo } from './service-plan.repo'

@Injectable()
export class ServicePlanService {
  constructor(private servicePlanRepo: ServicePlanRepo) {}

  async list(pagination: PaginationQueryType) {
    const data = await this.servicePlanRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const servicePlan = await this.servicePlanRepo.findById(id)
    if (!servicePlan) {
      throw NotFoundRecordException
    }
    return {
      data: servicePlan,
      message: 'Lấy danh mục thành công'
    }
  }

  async create({
    data,
    createdById,
    roleName
  }: {
    data: CreateServicePlanBodyType
    createdById: number
    roleName: string
  }) {
    try {
      if (roleName !== Role.ADMIN_SYSTEM) {
        throw UnauthorizedAccessException
      }
      const result = await this.servicePlanRepo.create({
        createdById,
        data
      })
      return {
        data: result,
        message: SERVICE_PLAN_MESSAGE.CREATED_SUCCESSFUL
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ServicePlanAlreadyExistsException
      }
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById,
    roleName
  }: {
    id: number
    data: UpdateServicePlanBodyType
    updatedById: number
    roleName: string
  }) {
    try {
      if (roleName !== Role.ADMIN_SYSTEM) {
        throw UnauthorizedAccessException
      }
      const servicePlan = await this.servicePlanRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: servicePlan,
        message: SERVICE_PLAN_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw ServicePlanAlreadyExistsException
      }
      throw error
    }
  }

  async delete({
    id,
    deletedById,
    roleName
  }: {
    id: number
    deletedById: number
    roleName: string
  }) {
    try {
      if (roleName !== Role.ADMIN_SYSTEM) {
        throw UnauthorizedAccessException
      }
      await this.servicePlanRepo.delete({
        id,
        deletedById
      })
      return {
        message: SERVICE_PLAN_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
