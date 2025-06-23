import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateQosInstanceBodyDTO,
  GetQosInstanceDetailResDTO,
  GetQosInstanceDetailResWithfullDTO,
  GetQosInstanceesResDTO,
  GetQosInstanceParamsDTO,
  UpdateQosInstanceBodyDTO
} from './qos-instance.dto'
import { QosInstanceService } from './qos-instance.service'

@Controller('qos-instances')
export class QosInstanceController {
  constructor(private readonly qosInstanceService: QosInstanceService) {}

  @Get()
  @ZodSerializerDto(GetQosInstanceesResDTO)
  list(@Query() query: PaginationQueryDTO, @ActiveUser('roleName') roleName: string) {
    return this.qosInstanceService.list(
      {
        page: query.page,
        limit: query.limit
      },
      roleName
    )
  }

  @Get(':qosInstanceId')
  @ZodSerializerDto(GetQosInstanceDetailResWithfullDTO)
  findById(
    @Param() params: GetQosInstanceParamsDTO,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.qosInstanceService.findById(params.qosInstanceId, roleName)
  }

  @Post()
  @ZodSerializerDto(GetQosInstanceDetailResDTO)
  create(
    @Body() body: CreateQosInstanceBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.qosInstanceService.create({
      data: body,
      createdById: userId,
      roleName
    })
  }

  @Put(':qosInstanceId')
  @ZodSerializerDto(GetQosInstanceDetailResDTO)
  update(
    @Body() body: UpdateQosInstanceBodyDTO,
    @Param() params: GetQosInstanceParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.qosInstanceService.update({
      data: body,
      id: params.qosInstanceId,
      updatedById: userId,
      roleName
    })
  }

  @Delete(':qosInstanceId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetQosInstanceParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.qosInstanceService.delete({
      id: params.qosInstanceId,
      deletedById: userId,
      roleName
    })
  }
}
