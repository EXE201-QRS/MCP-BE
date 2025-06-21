import { createZodDto } from 'nestjs-zod'
import {
  ForgotPasswordBodySchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
  SessionTokenBodySchema
} from 'src/routes/auth/auth.model'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class SessionTokenBodyDTO extends createZodDto(SessionTokenBodySchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}

export class ForgotPasswordBodyDTO extends createZodDto(ForgotPasswordBodySchema) {}
