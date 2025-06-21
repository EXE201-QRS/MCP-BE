import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { UserAgent } from '@/common/decorators/user-agent.decorator'
import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO
} from '@/routes/auth/auth.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { GetAccountProfileResDTO } from '@/shared/dtos/shared-user.dto'
import { Body, Controller, Get, Ip, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { AuthService } from './auth.service'

@Controller({
  path: 'auth',
  version: '1'
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO) //RES
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip
    })
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

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.sessionToken)
  }

  @Get('me')
  @ZodSerializerDto(GetAccountProfileResDTO)
  me(@ActiveUser('userId') userId: number) {
    return this.authService.getMe(userId)
  }
}
