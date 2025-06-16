import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateCustomerFormBodyDTO,
  GetCustomerFormDetailResDTO,
  GetCustomerFormParamsDTO,
  GetCustomerFormsResDTO,
  UpdateCustomerFormBodyDTO
} from './customer-form.dto'
import { CustomerFormService } from './customer-form.service'
@Controller('customer-forms')
export class CustomerFormController {
  constructor(private readonly customerFormService: CustomerFormService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetCustomerFormsResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.customerFormService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':customerFormId')
  @IsPublic()
  @ZodSerializerDto(GetCustomerFormDetailResDTO)
  findById(@Param() params: GetCustomerFormParamsDTO) {
    return this.customerFormService.findById(params.customerFormId)
  }

  @Post()
  @IsPublic()
  @ZodSerializerDto(GetCustomerFormDetailResDTO)
  create(@Body() body: CreateCustomerFormBodyDTO) {
    return this.customerFormService.create({
      data: body
    })
  }

  @Put(':customerFormId')
  @ZodSerializerDto(GetCustomerFormDetailResDTO)
  update(
    @Body() body: UpdateCustomerFormBodyDTO,
    @Param() params: GetCustomerFormParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.customerFormService.update({
      data: body,
      id: params.customerFormId,
      updatedById: userId
    })
  }

  @Delete(':customerFormId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetCustomerFormParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.customerFormService.delete({
      id: params.customerFormId,
      deletedById: userId
    })
  }
}
