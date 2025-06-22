import { ActiveUser } from '@/common/decorators/active-user.decorator'
import { IsPublic } from '@/common/decorators/auth.decorator'
import { MessageResDTO } from '@/shared/dtos/response.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  BlogDetailResponseDTO,
  BlogListResponseDTO,
  BlogStatsResponseDTO,
  CreateBlogBodyDTO,
  GetBlogBySlugParamsDTO,
  GetBlogParamsDTO,
  GetBlogsQueryDTO,
  IncrementViewBodyDTO,
  TogglePublishBodyDTO,
  UpdateBlogBodyDTO
} from './blog.dto'
import { BlogService } from './blog.service'

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('admin')
  @ZodSerializerDto(BlogListResponseDTO)
  async adminList(
    @Query() query: GetBlogsQueryDTO,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.list({ query, roleName })
  }

  @Get('admin/stats')
  @ZodSerializerDto(BlogStatsResponseDTO)
  async getStats(@ActiveUser('roleName') roleName: string) {
    return this.blogService.getStats(roleName)
  }

  @Get('admin/:blogId')
  @ZodSerializerDto(BlogDetailResponseDTO)
  async adminFindById(
    @Param() params: GetBlogParamsDTO,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.findById(params.blogId, roleName)
  }

  @Post('admin')
  @ZodSerializerDto(BlogDetailResponseDTO)
  async create(
    @Body() body: CreateBlogBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.create({
      data: body,
      createdById: userId,
      roleName
    })
  }

  @Put('admin/:blogId')
  @ZodSerializerDto(BlogDetailResponseDTO)
  async update(
    @Param() params: GetBlogParamsDTO,
    @Body() body: UpdateBlogBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.update({
      id: params.blogId,
      data: body,
      updatedById: userId,
      roleName
    })
  }

  @Delete('admin/:blogId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param() params: GetBlogParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.delete({
      id: params.blogId,
      deletedById: userId,
      roleName
    })
  }

  @Put('admin/:blogId/publish')
  @ZodSerializerDto(BlogDetailResponseDTO)
  async togglePublish(
    @Param() params: GetBlogParamsDTO,
    @Body() body: TogglePublishBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleName') roleName: string
  ) {
    return this.blogService.togglePublish({
      id: params.blogId,
      data: body,
      updatedById: userId,
      roleName
    })
  }

  // =================
  // PUBLIC ENDPOINTS
  // =================

  @Get()
  @IsPublic()
  @ZodSerializerDto(BlogListResponseDTO)
  async list(@Query() query: GetBlogsQueryDTO) {
    return this.blogService.listPublished(query)
  }

  @Get(':slug')
  @IsPublic()
  @ZodSerializerDto(BlogDetailResponseDTO)
  async findBySlug(@Param() params: GetBlogBySlugParamsDTO) {
    return this.blogService.findBySlug(params.slug, true)
  }

  @Put(':slug/view')
  @IsPublic()
  @ZodSerializerDto(BlogDetailResponseDTO)
  async incrementViews(
    @Param() params: GetBlogBySlugParamsDTO,
    @Body() body: IncrementViewBodyDTO
  ) {
    // Views are automatically incremented in findBySlug for public requests
    return this.blogService.findBySlug(params.slug, true)
  }

  @Put(':slug/like')
  @IsPublic()
  @ZodSerializerDto(BlogDetailResponseDTO)
  async incrementLikes(@Param() params: GetBlogBySlugParamsDTO) {
    return this.blogService.incrementLikes(params.slug)
  }
}
