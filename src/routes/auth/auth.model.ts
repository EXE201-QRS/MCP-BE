import { TypeOfVerificationCode } from '@/common/constants/auth.constant'
import { UserSchema } from '@/shared/models/shared-user.model'
import { z } from 'zod'
import { CustomerSchema } from '../customer/customer.model'

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true
}).strict()

export const LoginResSchema = z.object({
  data: z.object({ sessionToken: z.string() }),
  message: z.string()
})

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  roleName: true
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword']
      })
    }
  })

export const GetAccountProfileResSchema = UserSchema.omit({
  password: true
}).extend({
  customer: CustomerSchema.pick({
    id: true,
    restaurantName: true,
    restaurantAddress: true,
    restaurantPhone: true
  }).nullable()
})

export const RegisterResSchema = UserSchema.omit({
  password: true
})

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    TypeOfVerificationCode.REGISTER,
    TypeOfVerificationCode.FORGOT_PASSWORD,
    TypeOfVerificationCode.LOGIN
  ]),
  expiresAt: z.date(),
  createdAt: z.date()
})

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và mật khẩu xác nhận phải giống nhau',
        path: ['confirmNewPassword']
      })
    }
  })
export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true
}).strict()

export const SessionTokenBodySchema = z
  .object({
    sessionToken: z.string()
  })
  .strict()

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean()
})

export const SessionTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  name: z.string(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date()
})

export const LogoutBodySchema = SessionTokenBodySchema

//type
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type SessionTokenType = z.infer<typeof SessionTokenSchema>
export type SessionTokenBodyType = z.infer<typeof SessionTokenBodySchema>
export type DeviceType = z.infer<typeof DeviceSchema>
export type LogoutBodyType = SessionTokenBodyType
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>
