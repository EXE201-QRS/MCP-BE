import { CustomerType } from '@/routes/customer/customer.model'
import { Injectable } from '@nestjs/common'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'
type UserIncludeCustomerType = UserType & {
  customer: CustomerType | null
}
export type WhereUniqueUserType = { id: number } | { email: string }

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null
      }
    })
  }

  update(where: { id: number }, data: Partial<UserType>): Promise<UserType | null> {
    return this.prismaService.user.update({
      where: {
        ...where,
        deletedAt: null
      },
      data
    })
  }
  findUniqueIncludeCustomer(
    where: WhereUniqueUserType
  ): Promise<UserIncludeCustomerType | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null
      },
      include: {
        customer: true
      }
    })
  }
}
