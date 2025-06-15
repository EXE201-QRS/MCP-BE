import { SERVER_MESSAGE } from '@/common/constants/message'
import { NotFoundRecordException } from '@/shared/error'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError
} from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'
import { CusTomerFormServerExistsException } from './server.error'
import { CreateServerBodyType, UpdateServerBodyType } from './server.model'
import { ServerRepo } from './server.repo'

@Injectable()
export class ServerService {
  constructor(private serverRepo: ServerRepo) {}

  async list(pagination: PaginationQueryType) {
    const data = await this.serverRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const server = await this.serverRepo.findById(id)
    if (!server) {
      throw NotFoundRecordException
    }
    return {
      data: server,
      message: SERVER_MESSAGE.GET_DETAIL_SUCCESSFUL
    }
  }

  async create({
    data,
    createdById
  }: {
    data: CreateServerBodyType
    createdById: number
  }) {
    try {
      const result = await this.serverRepo.create({
        data,
        createdById
      })
      return {
        data: result,
        message: SERVER_MESSAGE.CREATED_SUCCESSFUL
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CusTomerFormServerExistsException
      }
      if (isForeignKeyConstraintPrismaError(error)) {
        throw CusTomerFormServerExistsException
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
    data: UpdateServerBodyType
    updatedById: number
  }) {
    try {
      const server = await this.serverRepo.update({
        id,
        updatedById,
        data
      })
      return {
        data: server,
        message: SERVER_MESSAGE.UPDATED_SUCCESSFUL
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
      await this.serverRepo.delete({
        id,
        deletedById
      })
      return {
        message: SERVER_MESSAGE.DELETED_SUCCESSFUL
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
