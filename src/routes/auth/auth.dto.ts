import { createZodDto } from 'nestjs-zod'
import {
  ForgotPasswordBodySchema,
  GetUserProfileResSchema,
  LoginBodySchema,
  LoginResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
  UpdateMeBodySchema
} from 'src/routes/auth/auth.model'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class ForgotPasswordBodyDTO extends createZodDto(ForgotPasswordBodySchema) {}

export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema) {}

export class UpdateMeBodyDTO extends createZodDto(UpdateMeBodySchema) {}
