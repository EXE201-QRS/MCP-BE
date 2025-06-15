import { PaginationQueryType } from '@/shared/models/request.model'
import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/shared/services/prisma.service'
import { GetServersResDTO } from './server.dto'
import { CreateServerBodyType, ServerType, UpdateServerBodyType } from './server.model'

@Injectable()
export class ServerRepo {
  constructor(private prismaService: PrismaService) {}

  create({
    data,
    createdById
  }: {
    data: CreateServerBodyType
    createdById
  }): Promise<ServerType> {
    return this.prismaService.server.create({
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
    data: UpdateServerBodyType
  }): Promise<ServerType> {
    return this.prismaService.server.update({
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
  ): Promise<ServerType> {
    return isHard
      ? this.prismaService.server.delete({
          where: {
            id
          }
        })
      : this.prismaService.server.update({
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

  async list(pagination: PaginationQueryType): Promise<GetServersResDTO> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.server.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.server.findMany({
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

  findById(id: number): Promise<ServerType | null> {
    return this.prismaService.server.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }
}
