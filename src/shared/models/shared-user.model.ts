import { Role } from '@/common/constants/auth.constant'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z
    .string()
    .max(100)
    .transform((val) => (val === '' ? null : val))
    .nullable(),
  roleName: z.enum([Role.ADMIN_SYSTEM, Role.CUSTOMER]).default(Role.CUSTOMER),
  password: z.string().min(6).max(100),
  phoneNumber: z
    .string()
    .min(9, 'Phone number must be at least 9 characters')
    .max(15, 'Phone number must not exceed 15 characters')
    .transform((val) => (val === '' ? null : val)) // Transform empty string to null
    .nullable(),
  avatar: z.string().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

//type
export type UserType = z.infer<typeof UserSchema>
