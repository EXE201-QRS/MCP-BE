import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateSubscriptionBodyDTO,
  GetSubscriptionDetailResDTO,
  GetSubscriptionDetailResWithUserServicePlanDTO,
  GetSubscriptionesResDTO,
  GetSubscriptionParamsDTO,
  GetSubscriptionWithQosInstanceServicePlanDTO,
  UpdateSubscriptionBodyDTO
} from './subscription.dto'
import { SubscriptionService } from './subscription.service'
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subsService: SubscriptionService) {}

  @Get()
  @ZodSerializerDto(GetSubscriptionesResDTO)
  list(@Query() query: PaginationQueryDTO, @ActiveUser('userId') userId: number) {
    return this.subsService.list({
      page: query.page,
      limit: query.limit,
      userId
    })
  }

  @Get('admin/all')
  @ZodSerializerDto(GetSubscriptionesResDTO)
  adminListAll(
    @Query() query: PaginationQueryDTO,
    @ActiveUser('roleName') roleName: string
  ) {
    // Only admin can access all subscriptions
    if (roleName !== 'ADMIN_SYSTEM') {
      throw new Error('Unauthorized')
    }
    return this.subsService.list({
      page: query.page,
      limit: query.limit
      // No userId filter for admin
    })
  }

  @Get(':subscriptionId')
  @IsPublic()
  @ZodSerializerDto(GetSubscriptionDetailResWithUserServicePlanDTO)
  findById(@Param() params: GetSubscriptionParamsDTO) {
    return this.subsService.findById(params.subscriptionId)
  }

  @Post()
  @ZodSerializerDto(GetSubscriptionDetailResDTO)
  create(@Body() body: CreateSubscriptionBodyDTO, @ActiveUser('userId') userId: number) {
    return this.subsService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':subscriptionId')
  @ZodSerializerDto(GetSubscriptionDetailResDTO)
  update(
    @Body() body: UpdateSubscriptionBodyDTO,
    @Param() params: GetSubscriptionParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.subsService.update({
      data: body,
      id: params.subscriptionId,
      updatedById: userId,
      roleName
    })
  }

  @Delete(':subscriptionId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetSubscriptionParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.subsService.delete({
      id: params.subscriptionId,
      deletedById: userId
    })
  }

  @Get(':subscriptionId/qos-health')
  @IsPublic()
  @ZodSerializerDto(GetSubscriptionWithQosInstanceServicePlanDTO)
  getInfoQos(@Param() params: GetSubscriptionParamsDTO) {
    return this.subsService.getInfoQos(params.subscriptionId)
  }
}
