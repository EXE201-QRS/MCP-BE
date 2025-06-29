import {
  CannotUpdateOrDeleteYourselfException,
  RoleNotFoundException,
  UserAlreadyExistsException
} from '@/routes/user/user.error'
import { CreateUserBodyType, UpdateUserBodyType } from '@/routes/user/user.model'
import { UserRepository } from '@/routes/user/user.repo'
import { NotFoundRecordException } from '@/shared/error'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError
} from '@/shared/helpers'
import { PaginationQueryType } from '@/shared/models/request.model'
import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { EmailService } from '@/shared/services/email.service'
import { HashingService } from '@/shared/services/hashing.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private hashingService: HashingService,
    private sharedUserRepository: SharedUserRepository,
    private emailService: EmailService
  ) {}

  //Get All
  list(pagination: PaginationQueryType) {
    return this.userRepo.list(pagination)
  }

  //get by id
  async findById(id: number) {
    const account = await this.sharedUserRepository.findUnique({
      id
    })
    if (!account) {
      throw NotFoundRecordException
    }
    return account
  }

  //create
  async create({ data, createdById }: { data: CreateUserBodyType; createdById: number }) {
    try {
      const password = this.generatePassword()
      //send mail to user with password
      await this.emailService.sendCreateAccountEmail({
        email: data.email,
        password
      })
      const hashedPassword = await this.hashingService.hash(password)

      const user = await this.userRepo.create({
        createdById,
        data: {
          ...data,
          password: hashedPassword
        }
      })
      return {
        data: user,
        message: 'Tạo tài khoản thành công'
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }
      throw error
    }
  }

  //update
  async update({
    id,
    data,
    updatedById
  }: {
    id: number
    data: UpdateUserBodyType
    updatedById: number
  }) {
    try {
      // Không thể cập nhật chính mình
      this.verifyYourself({
        userAgentId: updatedById,
        userTargetId: id
      })

      const updatedUser = await this.sharedUserRepository.update(
        { id },
        {
          ...data,
          updatedById
        }
      )
      return {
        data: updatedUser,
        message: 'Cập nhật tài khoản thành công'
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }

  private verifyYourself({
    userAgentId,
    userTargetId
  }: {
    userAgentId: number
    userTargetId: number
  }) {
    if (userAgentId === userTargetId) {
      throw CannotUpdateOrDeleteYourselfException
    }
  }

  //delete
  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      // Không thể xóa chính mình
      this.verifyYourself({
        userAgentId: deletedById,
        userTargetId: id
      })

      await this.userRepo.delete({
        id,
        deletedById
      })
      return {
        message: 'Delete successfully'
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  /**
   * Function generate password
   * @returns {string} - A random password string
   */
  private generatePassword(): string {
    const length = 10
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?'
    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }
}
