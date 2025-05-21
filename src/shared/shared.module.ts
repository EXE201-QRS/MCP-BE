import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { HashingService } from '@/shared/services/hashing.service'
import { PrismaService } from '@/shared/services/prisma.service'
import { TokenService } from '@/shared/services/token.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

const sharedServices = [PrismaService, HashingService, TokenService, SharedUserRepository]
@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [...sharedServices],
  exports: sharedServices
})
export class SharedModule {}
