import { createZodDto } from 'nestjs-zod'
import {
  BlogDetailResponseSchema,
  BlogListResponseSchema,
  BlogStatsResponseSchema,
  CreateBlogBodySchema,
  GetBlogBySlugParamsSchema,
  GetBlogParamsSchema,
  GetBlogsQuerySchema,
  IncrementViewBodySchema,
  TogglePublishBodySchema,
  UpdateBlogBodySchema
} from './blog.model'

// Request DTOs
export class CreateBlogBodyDTO extends createZodDto(CreateBlogBodySchema) {}
export class UpdateBlogBodyDTO extends createZodDto(UpdateBlogBodySchema) {}
export class GetBlogParamsDTO extends createZodDto(GetBlogParamsSchema) {}
export class GetBlogBySlugParamsDTO extends createZodDto(GetBlogBySlugParamsSchema) {}
export class GetBlogsQueryDTO extends createZodDto(GetBlogsQuerySchema) {}
export class TogglePublishBodyDTO extends createZodDto(TogglePublishBodySchema) {}
export class IncrementViewBodyDTO extends createZodDto(IncrementViewBodySchema) {}

// Response DTOs
export class BlogListResponseDTO extends createZodDto(BlogListResponseSchema) {}
export class BlogDetailResponseDTO extends createZodDto(BlogDetailResponseSchema) {}
export class BlogStatsResponseDTO extends createZodDto(BlogStatsResponseSchema) {}
