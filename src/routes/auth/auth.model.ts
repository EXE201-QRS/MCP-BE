import { UserSchema } from '@/shared/models/shared-user.model'
import { z } from 'zod'

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true
}).strict()

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
})

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export const RefreshTokenResSchema = LoginResSchema

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean()
})

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date()
})

export const LogoutBodySchema = RefreshTokenBodySchema

//type
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResType = LoginResType
export type DeviceType = z.infer<typeof DeviceSchema>
export type LogoutBodyType = RefreshTokenBodyType
