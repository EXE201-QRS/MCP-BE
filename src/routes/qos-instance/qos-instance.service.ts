import { QOS_INSTANCE_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'
import { UnauthorizedAccessException } from '../auth/auth.error'
import { SubscriptionRepo } from '../subscription/subscription.repo'
import { SubscriptionHasNotBeenPaid } from './qos-instance.error'
import {
  CreateQosInstanceBodyType,
  UpdateQosInstanceBodyType
} from './qos-instance.model'
import { QosInstanceRepo } from './qos-instance.repo'

@Injectable()
export class QosInstanceService {
  constructor(
    private qosInstanceRepo: QosInstanceRepo,
    private readonly subsRepo: SubscriptionRepo
  ) {}

  async create({
    data,
    createdById,
    roleName
  }: {
    data: CreateQosInstanceBodyType
    createdById: number
    roleName: string
  }) {
    try {
      if (!this.isAdmin(roleName)) {
        throw UnauthorizedAccessException
      }
      // check subscription thanh toán chưa ? -> chưa thì không được tạo
      const isSubscriptionPaid = await this.subsRepo.isSubscriptionPaid(
        data.subscriptionId
      )
      if (!isSubscriptionPaid) {
        throw SubscriptionHasNotBeenPaid
      }
      const result = await this.qosInstanceRepo.create({
        createdById,
        data
      })
      return {
        data: result,
        message: QOS_INSTANCE_MESSAGE.CREATED_SUCCESSFUL
      }
    } catch (error) {
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
    data: UpdateQosInstanceBodyType
    updatedById: number
    roleName: string
  }) {
    try {
      if (!this.isAdmin(roleName)) {
        throw UnauthorizedAccessException
      }
      const qosInstance = await this.qosInstanceRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: qosInstance,
        message: QOS_INSTANCE_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      // Handle not found pn (id)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }

      throw error
    }
  }

  async list(pagination: PaginationQueryType, roleName: string) {
    if (!this.isAdmin(roleName)) {
      throw UnauthorizedAccessException
    }
    const data = await this.qosInstanceRepo.list(pagination)
    return data
  }

  async findById(id: number, roleName: string) {
    if (!this.isAdmin(roleName)) {
      throw UnauthorizedAccessException
    }
    const qosInstance = await this.qosInstanceRepo.findWithUserSubsById(id)
    if (!qosInstance) {
      throw NotFoundRecordException
    }
    return {
      data: qosInstance,
      message: QOS_INSTANCE_MESSAGE.GET_DETAIL_SUCCESSFUL
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
      if (!this.isAdmin(roleName)) {
        throw UnauthorizedAccessException
      }
      await this.qosInstanceRepo.delete(
        {
          id,
          deletedById
        },
        true
      )
      return {
        message: QOS_INSTANCE_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  isAdmin(roleName: string): boolean {
    return roleName === Role.ADMIN_SYSTEM
  }
}
