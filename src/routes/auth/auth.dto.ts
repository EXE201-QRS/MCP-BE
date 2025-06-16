import { createZodDto } from 'nestjs-zod'
import {
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  SessionTokenBodySchema
} from 'src/routes/auth/auth.model'

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class SessionTokenBodyDTO extends createZodDto(SessionTokenBodySchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
