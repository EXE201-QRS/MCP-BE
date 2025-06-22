import { Injectable } from '@nestjs/common'
import { BlogStatus } from '@prisma/client'
import {
  BlogAlreadyPublishedError,
  BlogNotFoundError,
  BlogNotPublishedError,
  BlogSlugExistsError,
  validateBlogPermission
} from './blog.error'
import {
  CreateBlogBodySchemaType,
  GetBlogsQuerySchemaType,
  TogglePublishBodySchemaType,
  UpdateBlogBodySchemaType
} from './blog.model'
import { BlogRepository } from './blog.repo'

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  // Admin: Create blog post
  async create(params: {
    data: CreateBlogBodySchemaType
    createdById: number
    roleName: string
  }) {
    validateBlogPermission(params.roleName)

    const { data, createdById } = params

    // Generate slug if not provided
    const slug = this.generateSlug(data.title)

    // Check if slug already exists
    const existingBlog = await this.blogRepository.findBySlug(slug)
    if (existingBlog) {
      throw new BlogSlugExistsError()
    }

    // Set published date if status is PUBLISHED
    const publishedAt = data.status === BlogStatus.PUBLISHED ? new Date() : null

    const blog = await this.blogRepository.create({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      keywords: data.keywords || null,
      featuredImage: data.featuredImage || null,
      images: data.images || [],
      category: data.category || null,
      tags: data.tags || [],
      status: data.status || BlogStatus.DRAFT,
      publishedAt,
      createdBy: {
        connect: { id: createdById }
      }
    })

    return { data: blog }
  }

  // Admin: List all blog posts with filters
  async list(params: { query: GetBlogsQuerySchemaType; roleName?: string }) {
    const { query, roleName } = params
    const isPublic = roleName !== 'ADMIN_SYSTEM'

    const where = this.blogRepository.buildWhereClause(query, isPublic)
    const orderBy = this.blogRepository.buildOrderByClause(query)

    const result = await this.blogRepository.findMany({
      page: query.page || 1,
      limit: query.limit || 10,
      where,
      orderBy
    })

    return result
  }

  // Public: List published blog posts
  async listPublished(query: GetBlogsQuerySchemaType) {
    return this.list({ query, roleName: 'CUSTOMER' })
  }

  // Admin: Get blog by ID
  async findById(id: number, roleName?: string) {
    const blog = await this.blogRepository.findById(id)

    if (!blog) {
      throw new BlogNotFoundError()
    }

    // If public request, only return published blogs
    if (roleName !== 'ADMIN_SYSTEM' && blog.status !== BlogStatus.PUBLISHED) {
      throw new BlogNotFoundError()
    }

    return { data: blog }
  }

  // Public: Get blog by slug
  async findBySlug(slug: string, isPublic = true) {
    const blog = await this.blogRepository.findBySlug(slug)

    if (!blog) {
      throw new BlogNotFoundError()
    }

    // If public request, only return published blogs
    if (isPublic && blog.status !== BlogStatus.PUBLISHED) {
      throw new BlogNotFoundError()
    }

    // Increment views for public requests
    if (isPublic) {
      await this.blogRepository.incrementViews(blog.id)
      blog.views += 1
    }

    return { data: blog }
  }

  // Admin: Update blog post
  async update(params: {
    id: number
    data: UpdateBlogBodySchemaType
    updatedById: number
    roleName: string
  }) {
    validateBlogPermission(params.roleName)

    const { id, data, updatedById } = params

    const existingBlog = await this.blogRepository.findById(id)
    if (!existingBlog) {
      throw new BlogNotFoundError()
    }

    // Generate new slug if title changed
    let slug = existingBlog.slug
    if (data.title && data.title !== existingBlog.title) {
      slug = this.generateSlug(data.title)

      // Check if new slug already exists
      const slugExists = await this.blogRepository.findBySlugExcludeId(slug, id)
      if (slugExists) {
        throw new BlogSlugExistsError()
      }
    }

    // Handle status change to published
    let publishedAt = existingBlog.publishedAt
    if (
      data.status === BlogStatus.PUBLISHED &&
      existingBlog.status !== BlogStatus.PUBLISHED
    ) {
      publishedAt = new Date()
    } else if (data.status === BlogStatus.DRAFT) {
      publishedAt = null
    }

    const updateData: any = {
      ...data,
      slug,
      publishedAt,
      updatedBy: {
        connect: { id: updatedById }
      }
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const blog = await this.blogRepository.update(id, updateData)

    return { data: blog }
  }

  // Admin: Delete blog post (soft delete)
  async delete(params: { id: number; deletedById: number; roleName: string }) {
    validateBlogPermission(params.roleName)

    const { id, deletedById } = params

    const existingBlog = await this.blogRepository.findById(id)
    if (!existingBlog) {
      throw new BlogNotFoundError()
    }

    await this.blogRepository.softDelete(id, deletedById)

    return { message: 'Blog deleted successfully' }
  }

  // Admin: Toggle publish status
  async togglePublish(params: {
    id: number
    data: TogglePublishBodySchemaType
    updatedById: number
    roleName: string
  }) {
    validateBlogPermission(params.roleName)

    const { id, data, updatedById } = params

    const existingBlog = await this.blogRepository.findById(id)
    if (!existingBlog) {
      throw new BlogNotFoundError()
    }

    if (
      data.status === BlogStatus.PUBLISHED &&
      existingBlog.status === BlogStatus.PUBLISHED
    ) {
      throw new BlogAlreadyPublishedError()
    }

    if (data.status === BlogStatus.DRAFT && existingBlog.status === BlogStatus.DRAFT) {
      throw new BlogNotPublishedError()
    }

    const publishedAt = data.status === BlogStatus.PUBLISHED ? new Date() : null

    const blog = await this.blogRepository.update(id, {
      status: data.status,
      publishedAt,
      updatedBy: {
        connect: { id: updatedById }
      }
    })

    return { data: blog }
  }

  // Public: Increment likes
  async incrementLikes(slug: string) {
    const blog = await this.blogRepository.findBySlug(slug)
    if (!blog || blog.status !== BlogStatus.PUBLISHED) {
      throw new BlogNotFoundError()
    }

    const updatedBlog = await this.blogRepository.incrementLikes(blog.id)
    return { data: updatedBlog }
  }

  // Admin: Get blog statistics
  async getStats(roleName: string) {
    validateBlogPermission(roleName)

    const stats = await this.blogRepository.getStats()
    return { data: stats }
  }
}
