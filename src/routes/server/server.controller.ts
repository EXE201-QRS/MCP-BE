import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateServerBodyDTO,
  GetServerDetailResDTO,
  GetServerParamsDTO,
  GetServersResDTO,
  UpdateServerBodyDTO
} from './server.dto'
import { ServerService } from './server.service'
@Controller('servers')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  @ZodSerializerDto(GetServersResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.serverService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':serverId')
  @ZodSerializerDto(GetServerDetailResDTO)
  findById(@Param() params: GetServerParamsDTO) {
    return this.serverService.findById(params.serverId)
  }

  @Post()
  @ZodSerializerDto(GetServerDetailResDTO)
  create(@Body() body: CreateServerBodyDTO, @ActiveUser('userId') userId: number) {
    return this.serverService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':serverId')
  @ZodSerializerDto(GetServerDetailResDTO)
  update(
    @Body() body: UpdateServerBodyDTO,
    @Param() params: GetServerParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.serverService.update({
      data: body,
      id: params.serverId,
      updatedById: userId
    })
  }

  @Delete(':serverId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetServerParamsDTO, @ActiveUser('userId') userId: number) {
    return this.serverService.delete({
      id: params.serverId,
      deletedById: userId
    })
  }
}
