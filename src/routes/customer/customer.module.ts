import { Module } from '@nestjs/common'
import { CustomerController } from './customer.controller'
import { CustomerRepo } from './customer.repo'
import { CustomerService } from './customer.service'

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepo],
  exports: [CustomerService, CustomerRepo]
})
export class CustomerModule {}
