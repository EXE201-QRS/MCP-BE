import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateServicePlanBodyDTO,
  GetServicePlanDetailResDTO,
  GetServicePlanParamsDTO,
  GetServicePlansResDTO,
  UpdateServicePlanBodyDTO
} from './service-plan.dto'
import { ServicePlanService } from './service-plan.service'
@Controller('service-plans')
export class ServicePlanController {
  constructor(private readonly servicePlanService: ServicePlanService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetServicePlansResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.servicePlanService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':servicePlanId')
  @IsPublic()
  @ZodSerializerDto(GetServicePlanDetailResDTO)
  findById(@Param() params: GetServicePlanParamsDTO) {
    return this.servicePlanService.findById(params.servicePlanId)
  }

  @Post()
  @ZodSerializerDto(GetServicePlanDetailResDTO)
  create(@Body() body: CreateServicePlanBodyDTO, @ActiveUser('userId') userId: number) {
    return this.servicePlanService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':servicePlanId')
  @ZodSerializerDto(GetServicePlanDetailResDTO)
  update(
    @Body() body: UpdateServicePlanBodyDTO,
    @Param() params: GetServicePlanParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.servicePlanService.update({
      data: body,
      id: params.servicePlanId,
      updatedById: userId
    })
  }

  @Delete(':servicePlanId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetServicePlanParamsDTO, @ActiveUser('userId') userId: number) {
    return this.servicePlanService.delete({
      id: params.servicePlanId,
      deletedById: userId
    })
  }
}
