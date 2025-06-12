import { AUTH_MESSAGE } from '@/common/constants/auth.constant'
import {
  EmailNotFoundException,
  SessionTokenAlreadyUsedException,
  UnauthorizedAccessException
} from '@/routes/auth/auth.error'
import { LoginBodyType } from '@/routes/auth/auth.model'
import { AuthRepository } from '@/routes/auth/auth.repository'
import { InvalidPasswordException } from '@/shared/error'
import { isNotFoundPrismaError } from '@/shared/helpers'
import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { HashingService } from '@/shared/services/hashing.service'
import { TokenService } from '@/shared/services/token.service'
import { SessionTokenPayloadCreate } from '@/shared/types/jwt.type'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly tokenService: TokenService
  ) {}

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
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

    // 3. Tạo mới device
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip
    })

    // 4. Tạo mới session token
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      name: user.name
    })
    return {
      data: tokens,
      message: AUTH_MESSAGE.LOGIN_SUCCESS
    }
  }

  async generateTokens({ userId, deviceId, name }: SessionTokenPayloadCreate) {
    const sessionToken = await this.tokenService.signSessionToken({
      userId,
      deviceId,
      name
    })

    const decodedSessionToken = await this.tokenService.verifySessionToken(sessionToken)
    await this.authRepository.createSessionToken({
      token: sessionToken,
      userId,
      name,
      expiresAt: new Date(decodedSessionToken.exp * 1000),
      deviceId
    })
    return { sessionToken }
  }

  async logout(sessionToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      await this.tokenService.verifySessionToken(sessionToken)
      // 2. Xóa refreshToken trong database
      const deletedSessionToken = await this.authRepository.deleteSessionToken({
        token: sessionToken
      })
      // 3. Cập nhật device là đã logout
      await this.authRepository.updateDevice(deletedSessionToken.deviceId, {
        isActive: false
      })
      return { message: AUTH_MESSAGE.LOGOUT_SUCCESS }
    } catch (error) {
      // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
      // refresh token của họ đã bị đánh cắp
      if (isNotFoundPrismaError(error)) {
        throw SessionTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }
}
