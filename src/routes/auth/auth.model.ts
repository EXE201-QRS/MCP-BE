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
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type SessionTokenType = z.infer<typeof SessionTokenSchema>
export type SessionTokenBodyType = z.infer<typeof SessionTokenBodySchema>
export type DeviceType = z.infer<typeof DeviceSchema>
export type LogoutBodyType = SessionTokenBodyType
