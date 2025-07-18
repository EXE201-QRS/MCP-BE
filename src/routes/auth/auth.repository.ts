import { TypeOfVerificationCodeType } from '@/common/constants/auth.constant'
import { WhereUniqueUserType } from '@/shared/repositories/shared-user.repo'
import { Injectable } from '@nestjs/common'
import { VerificationCodeType } from 'src/routes/auth/auth.model'
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

  async createUser(
    user: Pick<
      UserType,
      'email' | 'name' | 'password' | 'phoneNumber' | 'roleName' | 'avatar'
    >
  ): Promise<Omit<UserType, 'password'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true
      }
    })
  }

  async registerUser(
    user: Pick<UserType, 'email' | 'roleName' | 'password'>
  ): Promise<Omit<UserType, 'password'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true
      }
    })
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_code_type: {
          email: payload.email,
          code: payload.code,
          type: payload.type
        }
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt
      }
    })
  }

  deleteVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_code_type: {
            email: string
            code: string
            type: TypeOfVerificationCodeType
          }
        }
  ): Promise<VerificationCodeType> {
    // Ensure both id and email_code_type are present, or only id
    const where: any = {}
    if ('id' in uniqueValue) {
      where.id = uniqueValue.id
    }
    if ('email_code_type' in uniqueValue) {
      where.email_code_type = uniqueValue.email_code_type
      // Prisma expects both id and email_code_type if either is present, so set id to undefined if not provided
      if (!('id' in uniqueValue)) {
        where.id = undefined
      }
    }
    return this.prismaService.verificationCode.delete({
      where
    })
  }
  async findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_code_type: {
            email: string
            code: string
            type: TypeOfVerificationCodeType
          }
        }
  ): Promise<VerificationCodeType | null> {
    const where: any = {}
    if ('id' in uniqueValue) {
      where.id = uniqueValue.id
    }
    if ('email_code_type' in uniqueValue) {
      where.email_code_type = uniqueValue.email_code_type
      if (!('id' in uniqueValue)) {
        where.id = undefined
      }
    }
    return this.prismaService.verificationCode.findUnique({
      where
    })
  }
}
