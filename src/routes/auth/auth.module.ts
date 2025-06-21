import { AuthRepository } from '@/routes/auth/auth.repository'
import { SharedModule } from '@/shared/shared.module'
import { Module } from '@nestjs/common'
import { CustomerModule } from '../customer/customer.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [SharedModule, CustomerModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository]
})
export class AuthModule {}
