import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { AccessTokenGuard } from '@/common/guards/access-token.guard'
import { APIKeyGuard } from '@/common/guards/api-key.guard'
import { AuthenticationGuard } from '@/common/guards/authentication.guard'
import CustomZodValidationPipe from '@/common/pipes/custom-zod-validation.pipe'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { AuthModule } from './routes/auth/auth.module'
import { CustomerFormModule } from './routes/customer-form/customer-form.module'
import { ServicePlanModule } from './routes/service-plan/service-plan.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [SharedModule, AuthModule, ServicePlanModule, CustomerFormModule],
  controllers: [],
  providers: [
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    }
  ]
})
export class AppModule {}
