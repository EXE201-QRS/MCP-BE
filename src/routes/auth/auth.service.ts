import {
  EmailNotFoundException,
  RefreshTokenAlreadyUsedException,
  UnauthorizedAccessException
} from '@/routes/auth/auth.error'
import { LoginBodyType, RefreshTokenBodyType } from '@/routes/auth/auth.model'
import { AuthRepository } from '@/routes/auth/auth.repository'
import { InvalidPasswordException } from '@/shared/error'
import { isNotFoundPrismaError } from '@/shared/helpers'
import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { HashingService } from '@/shared/services/hashing.service'
import { TokenService } from '@/shared/services/token.service'
import { AccessTokenPayloadCreate } from '@/shared/types/jwt.type'
import { HttpException, Injectable } from '@nestjs/common'

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

    // 4. Tạo mới accessToken và refreshToken
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id
    })
    return tokens
  }

  async generateTokens({ userId, deviceId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId
      }),
      this.tokenService.signRefreshToken({
        userId
      })
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({
    refreshToken,
    userAgent,
    ip
  }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Kiểm tra refreshToken có tồn tại trong database không
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken({
        token: refreshToken
      })
      if (!refreshTokenInDb) {
        // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
        // refresh token của họ đã bị đánh cắp
        throw RefreshTokenAlreadyUsedException
      }
      const { deviceId, user } = refreshTokenInDb
      // 3. Cập nhật device
      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent
      })
      // 4. Xóa refreshToken cũ
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      // 5. Tạo mới accessToken và refreshToken
      const $tokens = this.generateTokens({ userId, deviceId })
      const [, , tokens] = await Promise.all([
        $updateDevice,
        $deleteRefreshToken,
        $tokens
      ])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw UnauthorizedAccessException
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Xóa refreshToken trong database
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      // 3. Cập nhật device là đã logout
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false
      })
      return { message: 'Đăng xuất thành công' }
    } catch (error) {
      // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
      // refresh token của họ đã bị đánh cắp
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }
}
