import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { GetUserProfileResDTO } from '@/routes/auth/auth.dto'
import {
  ChangePasswordBodyDTO,
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserParamsDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO
} from '@/routes/user/user.dto'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.userService.list({
      page: query.page,
      limit: query.limit
    })
  }

  // 📝 Route change-password PHẢI đặt TRƯỚC :userId để tránh conflict
  @Put('change-password')
  @ZodSerializerDto(MessageResDTO)
  changePassword(
    @Body() body: ChangePasswordBodyDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.userService.changePassword({
      data: body,
      id: userId
    })
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserProfileResDTO)
  findById(@Param() params: GetUserParamsDTO) {
    return this.userService.findById(params.userId)
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(@Body() body: CreateUserBodyDTO, @ActiveUser('userId') userId: number) {
    return this.userService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateUserResDTO)
  update(
    @Body() body: UpdateUserBodyDTO,
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.userService.update({
      data: body,
      id: params.userId,
      updatedById: userId
    })
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetUserParamsDTO, @ActiveUser('userId') userId: number) {
    return this.userService.delete({
      id: params.userId,
      deletedById: userId
    })
  }
}
