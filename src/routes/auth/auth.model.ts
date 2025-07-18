import { TypeOfVerificationCode } from '@/common/constants/auth.constant'
import { UserSchema } from '@/shared/models/shared-user.model'
import { z } from 'zod'

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
  password: true
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

export const RegisterResSchema = LoginResSchema

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
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

export const GetUserProfileResSchema = z.object({
  data: UserSchema.omit({
    password: true
  }),
  message: z.string()
})

//update me
export const UpdateMeBodySchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    phoneNumber: z.string().min(9).max(15),
    avatar: z.string().url().optional()
  })
  .strict()

export const GetAuthorizationUrlResSchema = z.object({
  url: z.string().url()
})

//type
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>
export type GetUserProfileResType = z.infer<typeof GetUserProfileResSchema>
export type UpdateMeBodyType = z.infer<typeof UpdateMeBodySchema>
export type GetAuthorizationUrlResType = z.infer<typeof GetAuthorizationUrlResSchema>
