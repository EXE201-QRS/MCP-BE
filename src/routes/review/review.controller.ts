import { Role } from '@/common/constants/role'
import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { RequiredRole } from '@/common/decorators/role.decorator'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  AdminResponseReviewBodyDTO,
  CreateReviewBodyDTO,
  GetReviewDetailResDTO,
  GetReviewDetailResWithfullDTO,
  GetReviewesResDTO,
  GetReviewParamsDTO,
  GetReviewQueryDTO,
  UpdateReviewBodyDTO
} from './review.dto'
import { ReviewService } from './review.service'
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetReviewesResDTO)
  list(@Query() query: GetReviewQueryDTO) {
    return this.reviewService.list(query)
  }

  @Get('public')
  @IsPublic()
  @ZodSerializerDto(GetReviewesResDTO)
  getPublicReviews(@Query() query: GetReviewQueryDTO) {
    return this.reviewService.getPublicReviews(query)
  }

  @Get('admin/pending')
  @RequiredRole([Role.ADMIN_SYSTEM])
  @ZodSerializerDto(GetReviewesResDTO)
  getPendingReviews(@Query() query: GetReviewQueryDTO) {
    return this.reviewService.getPendingReviews(query)
  }

  @Get(':reviewId')
  @IsPublic()
  @ZodSerializerDto(GetReviewDetailResWithfullDTO)
  findById(@Param() params: GetReviewParamsDTO) {
    return this.reviewService.findById(params.reviewId)
  }

  @Post()
  @ZodSerializerDto(GetReviewDetailResDTO)
  create(@Body() body: CreateReviewBodyDTO, @ActiveUser('userId') userId: number) {
    return this.reviewService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':reviewId')
  @ZodSerializerDto(GetReviewDetailResDTO)
  update(
    @Body() body: UpdateReviewBodyDTO,
    @Param() params: GetReviewParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.reviewService.update({
      data: body,
      id: params.reviewId,
      updatedById: userId
    })
  }

  @Put(':reviewId/admin-response')
  @RequiredRole([Role.ADMIN_SYSTEM])
  @ZodSerializerDto(GetReviewDetailResDTO)
  adminResponse(
    @Body() body: AdminResponseReviewBodyDTO,
    @Param() params: GetReviewParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.reviewService.adminResponse({
      reviewId: params.reviewId,
      adminResponse: body.adminResponse,
      status: body.status,
      isPublic: body.isPublic,
      responsedById: userId
    })
  }

  @Put(':reviewId/toggle-public')
  @RequiredRole([Role.ADMIN_SYSTEM])
  @ZodSerializerDto(GetReviewDetailResDTO)
  togglePublic(
    @Param() params: GetReviewParamsDTO,
    @ActiveUser('userId') userId: number
  ) {
    return this.reviewService.togglePublic({
      reviewId: params.reviewId,
      updatedById: userId
    })
  }

  @Delete(':reviewId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetReviewParamsDTO, @ActiveUser('userId') userId: number) {
    return this.reviewService.delete({
      id: params.reviewId,
      deletedById: userId
    })
  }
}
