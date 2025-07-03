import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import {
  ForgotPasswordBodyDTO,
  GetUserProfileResDTO,
  LoginBodyDTO,
  LoginResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
  UpdateMeBodyDTO
} from '@/routes/auth/auth.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ZodSerializerDto(UpdateMeBodyDTO)
  updateMe(@ActiveUser('userId') userId: number, @Body() body: UpdateMeBodyDTO) {
    return this.authService.updateMe({ userId, body })
  }
}
