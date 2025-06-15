import { Module } from '@nestjs/common'
import { ServicePlanModule } from '../service-plan/service-plan.module'
import { CustomerFormController } from './customer-form.controller'
import { CustomerFormRepo } from './customer-form.repo'
import { CustomerFormService } from './customer-form.service'

@Module({
  imports: [ServicePlanModule],
  controllers: [CustomerFormController],
  providers: [CustomerFormService, CustomerFormRepo]
})
export class CustomerFormModule {}
