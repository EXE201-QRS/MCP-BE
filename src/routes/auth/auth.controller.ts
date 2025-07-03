import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import envConfig from '@/config/env.config'
import {
  ForgotPasswordBodyDTO,
  GetAuthorizationUrlResDTO,
  GetUserProfileResDTO,
  LoginBodyDTO,
  LoginResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
  UpdateMeBodyDTO
} from '@/routes/auth/auth.dto'
import { GoogleService } from '@/routes/auth/google.service'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ZodSerializerDto } from 'nestjs-zod'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO)
  login(@Body() body: LoginBodyDTO) {
    return this.authService.login(body)
  }

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body)
  }

  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body)
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body)
  }

  @Get('me')
  @ZodSerializerDto(GetUserProfileResDTO)
  me(@ActiveUser('userId') userId: number) {
    return this.authService.getMe(userId)
  }

  @Put('me')
  @ZodSerializerDto(MessageResDTO)
  updateMe(@ActiveUser('userId') userId: number, @Body() body: UpdateMeBodyDTO) {
    return this.authService.updateMe({ userId, body })
  }

  //oauth
  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl() {
    return this.googleService.getAuthorizationUrl()
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback(code)
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?sessionToken=${data.sessionToken}`
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`
      )
    }
  }
}
