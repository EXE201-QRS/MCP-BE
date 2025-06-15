import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { PaginationQueryDTO } from '@/shared/dtos/request.dto'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateReviewBodyDTO,
  GetReviewDetailResDTO,
  GetReviewParamsDTO,
  GetReviewsResDTO,
  UpdateReviewBodyDTO
} from './review.dto'
import { ReviewService } from './review.service'
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetReviewsResDTO)
  list(@Query() query: PaginationQueryDTO) {
    return this.reviewService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':reviewId')
  @ZodSerializerDto(GetReviewDetailResDTO)
  findById(@Param() params: GetReviewParamsDTO) {
    return this.reviewService.findById(params.reviewId)
  }

  @Post()
  @IsPublic()
  @ZodSerializerDto(GetReviewDetailResDTO)
  create(@Body() body: CreateReviewBodyDTO) {
    return this.reviewService.create({
      data: body
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
