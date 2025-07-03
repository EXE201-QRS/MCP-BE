import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { AccessTokenGuard } from '@/common/guards/access-token.guard'
import { APIKeyGuard } from '@/common/guards/api-key.guard'
import { AuthenticationGuard } from '@/common/guards/authentication.guard'
import CustomZodValidationPipe from '@/common/pipes/custom-zod-validation.pipe'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { SendMailToPaymentCronjob } from './cronjobs/send-mail-to-payment.cronjob'
import { AuthModule } from './routes/auth/auth.module'
import { DashboardModule } from './routes/dashboard/dashboard.module'
import { MediaModule } from './routes/media/media.module'
import { PaymentModule } from './routes/payment/payment.module'
import { QosInstanceModule } from './routes/qos-instance/qos-instance.module'
import { ReviewModule } from './routes/review/review.module'
import { ServicePlanModule } from './routes/service-plan/service-plan.module'
import { SubscriptionModule } from './routes/subscription/subscription.module'
import { UserModule } from './routes/user/user.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SharedModule,
    AuthModule,
    ServicePlanModule,
    SubscriptionModule,
    ReviewModule,
    MediaModule,
    PaymentModule,
    QosInstanceModule,
    UserModule,
    DashboardModule
  ],
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
    },
    SendMailToPaymentCronjob
  ]
})
export class AppModule {}
