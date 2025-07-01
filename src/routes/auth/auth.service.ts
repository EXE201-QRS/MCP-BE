import {
  AUTH_MESSAGE,
  TypeOfVerificationCode,
  TypeOfVerificationCodeType
} from '@/common/constants/auth.constant'
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  OTPExpiredException
} from '@/routes/auth/auth.error'
import {
  LoginBodyType,
  RegisterBodyType,
  SendOTPBodyType
} from '@/routes/auth/auth.model'
import { AuthRepository } from '@/routes/auth/auth.repository'
import { InvalidPasswordException } from '@/shared/error'
import { generateOTP, isUniqueConstraintPrismaError } from '@/shared/helpers'
import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { EmailService } from '@/shared/services/email.service'
import { HashingService } from '@/shared/services/hashing.service'
import { TokenService } from '@/shared/services/token.service'
import { SessionTokenPayloadCreate } from '@/shared/types/jwt.type'
import { Injectable } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/config/env.config'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}

  async login(body: LoginBodyType) {
    // 1. Lấy thông tin user, kiểm tra user có tồn tại hay không, mật khẩu có đúng không
    const user = await this.authRepository.findUniqueUser({
      email: body.email
    })
    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordMatch = await this.hashingService.compare(
      body.password,
      user.password
    )
    if (!isPasswordMatch) {
      throw InvalidPasswordException
    }

    // 4. Tạo mới session token
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email || '',
      roleName: user.roleName
    })
    return {
      data: tokens,
      message: AUTH_MESSAGE.LOGIN_SUCCESS
    }
  }

  generateTokens({ userId, email, roleName }: SessionTokenPayloadCreate): Promise<{
    sessionToken: string
  }> {
    const token = this.tokenService.signSessionToken({
      userId,
      email,
      roleName
    })
    return Promise.resolve({ sessionToken: token })
  }

  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER
      })
      const hashedPassword = await this.hashingService.hash(body.password)
      const [user] = await Promise.all([
        this.authRepository.registerUser({
          email: body.email,
          password: hashedPassword,
          roleName: 'CUSTOMER'
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.REGISTER
          }
        })
      ])
      const tokens = await this.generateTokens({
        userId: user.id,
        email: user.email || '',
        roleName: user.roleName
      })
      return {
        data: tokens,
        message: AUTH_MESSAGE.REGISTER_SUCCESS
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email
    })
    if (body.type === TypeOfVerificationCode.REGISTER && user) {
      throw EmailAlreadyExistsException
    }
    if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
      throw EmailNotFoundException
    }
    // 2. Tạo mã OTP
    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN))
    })
    // 3. Gửi mã OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code
    })
    if (error) {
      throw FailedToSendOTPException
    }
    return { message: 'Gửi mã OTP thành công' }
  }

  async validateVerificationCode({
    email,
    code,
    type
  }: {
    email: string
    code: string
    type: TypeOfVerificationCodeType
  }) {
    const vevificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type
      }
    })
    if (!vevificationCode) {
      throw InvalidOTPException
    }
    if (vevificationCode.expiresAt < new Date()) {
      throw OTPExpiredException
    }
    return vevificationCode
  }

  async getMe(userId: number) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId
    })
    if (!user) {
      throw EmailNotFoundException
    }
    return {
      data: user,
      message: 'Lấy thông tin người dùng thành công'
    }
  }
}
