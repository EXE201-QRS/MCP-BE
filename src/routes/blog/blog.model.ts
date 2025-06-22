import { z } from 'zod'

// Enums
export const BlogStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

// Base schemas
export const CreateBlogBodySchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().max(1000, 'Excerpt too long').optional(),
    metaTitle: z.string().max(500, 'Meta title too long').optional(),
    metaDescription: z.string().max(1000, 'Meta description too long').optional(),
    keywords: z.string().max(500, 'Keywords too long').optional(),
    featuredImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().max(200, 'Category too long').optional(),
    tags: z.array(z.string()).optional(),
    status: BlogStatusEnum.optional()
  })
  .strict()

export const UpdateBlogBodySchema = CreateBlogBodySchema.partial()

export const GetBlogParamsSchema = z
  .object({
    blogId: z.coerce.number().int().positive('Invalid blog ID')
  })
  .strict()

export const GetBlogBySlugParamsSchema = z
  .object({
    slug: z.string().min(1, 'Slug is required')
  })
  .strict()

export const GetBlogsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    status: BlogStatusEnum.optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'publishedAt', 'views', 'likes']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
  .strict()

export const TogglePublishBodySchema = z
  .object({
    status: z.enum(['PUBLISHED', 'DRAFT'])
  })
  .strict()

export const IncrementViewBodySchema = z.object({}).strict()

// Response schemas
export const BlogResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  keywords: z.string().nullable(),
  featuredImage: z.string().nullable(),
  images: z.array(z.string()),
  status: BlogStatusEnum,
  publishedAt: z.date().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  views: z.number(),
  likes: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z
    .object({
      id: z.number(),
      name: z.string().nullable(),
      email: z.string()
    })
    .nullable()
})

export const BlogListResponseSchema = z.object({
  data: z.array(BlogResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
})

export const BlogDetailResponseSchema = z.object({
  data: BlogResponseSchema
})

export const BlogStatsResponseSchema = z.object({
  data: z.object({
    totalBlogs: z.number(),
    publishedBlogs: z.number(),
    draftBlogs: z.number(),
    totalViews: z.number(),
    totalLikes: z.number(),
    popularCategories: z.array(
      z.object({
        category: z.string(),
        count: z.number()
      })
    )
  })
})

// Type exports
export type CreateBlogBodySchemaType = z.infer<typeof CreateBlogBodySchema>
export type UpdateBlogBodySchemaType = z.infer<typeof UpdateBlogBodySchema>
export type GetBlogParamsSchemaType = z.infer<typeof GetBlogParamsSchema>
export type GetBlogBySlugParamsSchemaType = z.infer<typeof GetBlogBySlugParamsSchema>
export type GetBlogsQuerySchemaType = z.infer<typeof GetBlogsQuerySchema>
export type TogglePublishBodySchemaType = z.infer<typeof TogglePublishBodySchema>
export type BlogResponseSchemaType = z.infer<typeof BlogResponseSchema>
