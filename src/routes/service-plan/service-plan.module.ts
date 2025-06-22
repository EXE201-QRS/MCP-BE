import { Module } from '@nestjs/common'
import { ServicePlanController } from './service-plan.controller'
import { ServicePlanRepo } from './service-plan.repo'
import { ServicePlanService } from './service-plan.service'

@Module({
  controllers: [ServicePlanController],
  providers: [ServicePlanService, ServicePlanRepo],
  exports: [ServicePlanService, ServicePlanRepo]
})
export class ServicePlanModule {}
