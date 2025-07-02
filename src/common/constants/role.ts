export const Role = {
  ADMIN_SYSTEM: 'ADMIN_SYSTEM',
  CUSTOMER: 'CUSTOMER'
} as const

export type RoleType = (typeof Role)[keyof typeof Role]
