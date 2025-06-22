import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateReviewBodyDTO,
  GetReviewDetailResDTO,
  GetReviewDetailResWithfullDTO,
  GetReviewesResDTO,
  GetReviewParamsDTO,
  UpdateReviewBodyDTO
} from './review.dto'
import { ReviewService } from './review.service'
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetReviewesResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.reviewService.list({
      page: query.page,
      limit: query.limit
    })
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

  @Delete(':reviewId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetReviewParamsDTO, @ActiveUser('userId') userId: number) {
    return this.reviewService.delete({
      id: params.reviewId,
      deletedById: userId
    })
  }
}
