import { AccessTokenGuard } from '@/common/guards/access-token.guard'
import { APIKeyGuard } from '@/common/guards/api-key.guard'
import { AuthenticationGuard } from '@/common/guards/authentication.guard'
import { SharedUserRepository } from '@/shared/repositories/shared-user.repo'
import { HashingService } from '@/shared/services/hashing.service'
import { PrismaService } from '@/shared/services/prisma.service'
import { TokenService } from '@/shared/services/token.service'
import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { EmailService } from './services/email.service'
import { S3Service } from './services/S3.service'

const sharedServices = [
  PrismaService,
  EmailService,
  HashingService,
  TokenService,
  SharedUserRepository,
  S3Service
]
@Global()
@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    }
  ],
  exports: sharedServices
})
export class SharedModule {}
