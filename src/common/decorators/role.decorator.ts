import { RoleType } from '@/common/constants/role'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const RequiredRole = (roles: RoleType[]) => SetMetadata(ROLES_KEY, roles)
