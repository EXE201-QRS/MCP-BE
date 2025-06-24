import { Role } from '@/common/constants/auth.constant'
import { SUBSCRIPTION_MESSAGE } from '@/common/constants/message'
import { SubscriptionStatus } from '@/common/constants/subscription.constant'
import { NotFoundRecordException } from '@/shared/error'
import { isNotFoundPrismaError, mapEnumToDays } from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { DurationDays } from '@prisma/client'
import { UnathoriedAfterPaymentException } from './subscription.error'
import {
  CreateSubscriptionBodyType,
  UpdateSubscriptionBodyType
} from './subscription.model'
import { SubscriptionRepo } from './subscription.repo'

@Injectable()
export class SubscriptionService {
  constructor(private subsRepo: SubscriptionRepo) {}

  async create({
    data,
    createdById
  }: {
    data: CreateSubscriptionBodyType
    createdById: number
  }) {
    try {
      const result = await this.subsRepo.create({
        createdById,
        data
      })
      return {
        data: result,
        message: SUBSCRIPTION_MESSAGE.CREATED_SUCCESSFUL
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
    data: UpdateSubscriptionBodyType
    updatedById: number
    roleName: string
  }) {
    try {
      // nếu đã thanh toán thì cus ko đc update nữa
      if (roleName === Role.CUSTOMER && data.status !== SubscriptionStatus.PENDING) {
        throw UnathoriedAfterPaymentException
      }
      //check status === ACTIVE update startDate and endDate
      if (data.status === SubscriptionStatus.ACTIVE) {
        const startDate = new Date()
        const duration = parseInt(mapEnumToDays(data.durationDays as DurationDays), 10) // convert string to number
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + duration)

        data.startDate = startDate
        data.endDate = endDate
      }
      const subs = await this.subsRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: subs,
        message: SUBSCRIPTION_MESSAGE.UPDATED_SUCCESSFUL
      }
    } catch (error) {
      // Handle not found pn (id)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }

      throw error
    }
  }

  async list(pagination: PaginationQueryType & { userId?: number }) {
    const data = await this.subsRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const subs = await this.subsRepo.findWithUserServicePlanById(id)
    if (!subs) {
      throw NotFoundRecordException
    }
    return {
      data: subs,
      message: SUBSCRIPTION_MESSAGE.GET_DETAIL_SUCCESSFUL
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.subsRepo.delete({
        id,
        deletedById
      })
      return {
        message: SUBSCRIPTION_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
