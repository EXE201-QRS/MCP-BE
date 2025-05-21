import { WhereUniqueUserType } from '@/shared/repositories/shared-user.repo'
import { Injectable } from '@nestjs/common'
import { DeviceType, RefreshTokenType } from 'src/routes/auth/auth.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUniqueUser(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null
      }
    })
  }

  async findUniqueRefreshToken(where: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where,
      include: {
        user: true
      }
    })
  }

  async createUser(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'phoneNumber'>
  ): Promise<Omit<UserType, 'password'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true
      }
    })
  }

  createRefreshToken(data: {
    token: string
    userId: number
    expiresAt: Date
    deviceId: number
  }) {
    return this.prismaService.refreshToken.create({
      data
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> &
      Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>
  ) {
    return this.prismaService.device.create({
      data
    })
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId
      },
      data
    })
  }

  deleteRefreshToken(where: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where
    })
  }
}
