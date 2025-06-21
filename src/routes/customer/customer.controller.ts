import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateCustomerBodyDTO,
  GetCustomerDetailResDTO,
  GetCustomerDetailResWithUserDTO,
  GetCustomeresResDTO,
  GetCustomerParamsDTO,
  UpdateCustomerBodyDTO
} from './customer.dto'
import { CustomerService } from './customer.service'
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetCustomeresResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.customerService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':customerId')
  @IsPublic()
  @ZodSerializerDto(GetCustomerDetailResWithUserDTO)
  findById(@Param() params: GetCustomerParamsDTO) {
    return this.customerService.findById(params.customerId)
  }

  @Post()
  @ZodSerializerDto(GetCustomerDetailResDTO)
  create(@Body() body: CreateCustomerBodyDTO) {
    console.log(body)

    return this.customerService.create({
      data: body
    })
  }

  @Put(':customerId')
  @ZodSerializerDto(GetCustomerDetailResDTO)
  update(
    @Body() body: UpdateCustomerBodyDTO,
    @Param() params: GetCustomerParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.customerService.update({
      data: body,
      id: params.customerId,
      updatedById: userId
    })
  }

  @Delete(':customerId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetCustomerParamsDTO, @ActiveUser('userId') userId: number) {
    return this.customerService.delete({
      id: params.customerId,
      deletedById: userId
    })
  }
}
