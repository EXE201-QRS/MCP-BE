import { PrismaService } from '@/shared/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { Blog, BlogStatus, Prisma } from '@prisma/client'
import { GetBlogsQuerySchemaType } from './blog.model'

@Injectable()
export class BlogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BlogCreateInput): Promise<Blog> {
    return this.prisma.blog.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async findMany(params: {
    page?: number
    limit?: number
    where?: Prisma.BlogWhereInput
    orderBy?: Prisma.BlogOrderByWithRelationInput[]
  }) {
    const { page = 1, limit = 10, where, orderBy } = params
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      this.prisma.blog.count({ where })
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findById(id: number): Promise<Blog | null> {
    return this.prisma.blog.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return this.prisma.blog.findFirst({
      where: {
        slug,
        deletedAt: null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async findBySlugExcludeId(slug: string, excludeId: number): Promise<Blog | null> {
    return this.prisma.blog.findFirst({
      where: {
        slug,
        id: {
          not: excludeId
        },
        deletedAt: null
      }
    })
  }

  async update(id: number, data: Prisma.BlogUpdateInput): Promise<Blog> {
    return this.prisma.blog.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async softDelete(id: number, deletedById: number): Promise<Blog> {
    return this.prisma.blog.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById
      }
    })
  }

  async incrementViews(id: number): Promise<Blog> {
    return this.prisma.blog.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    })
  }

  async incrementLikes(id: number): Promise<Blog> {
    return this.prisma.blog.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    })
  }

  async getStats() {
    const [totalBlogs, publishedBlogs, draftBlogs, viewsLikes, popularCategories] =
      await Promise.all([
        this.prisma.blog.count({
          where: { deletedAt: null }
        }),
        this.prisma.blog.count({
          where: {
            status: BlogStatus.PUBLISHED,
            deletedAt: null
          }
        }),
        this.prisma.blog.count({
          where: {
            status: BlogStatus.DRAFT,
            deletedAt: null
          }
        }),
        this.prisma.blog.aggregate({
          where: { deletedAt: null },
          _sum: {
            views: true,
            likes: true
          }
        }),
        this.prisma.blog.groupBy({
          by: ['category'],
          where: {
            deletedAt: null,
            category: {
              not: null
            }
          },
          _count: {
            category: true
          },
          orderBy: {
            _count: {
              category: 'desc'
            }
          },
          take: 5
        })
      ])

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews: viewsLikes._sum.views || 0,
      totalLikes: viewsLikes._sum.likes || 0,
      popularCategories: popularCategories.map((item) => ({
        category: item.category || 'Uncategorized',
        count: item._count.category
      }))
    }
  }

  buildWhereClause(
    query: GetBlogsQuerySchemaType,
    isPublic = false
  ): Prisma.BlogWhereInput {
    const where: Prisma.BlogWhereInput = {
      deletedAt: null
    }

    if (isPublic) {
      where.status = BlogStatus.PUBLISHED
    }

    if (query.status) {
      where.status = query.status as BlogStatus
    }

    if (query.category) {
      where.category = {
        contains: query.category,
        mode: 'insensitive'
      }
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          excerpt: {
            contains: query.search,
            mode: 'insensitive'
          }
        }
      ]
    }

    return where
  }

  buildOrderByClause(
    query: GetBlogsQuerySchemaType
  ): Prisma.BlogOrderByWithRelationInput[] {
    const orderBy: Prisma.BlogOrderByWithRelationInput[] = []

    if (query.sortBy && query.sortOrder) {
      orderBy.push({
        [query.sortBy]: query.sortOrder
      })
    }

    // Default sort by createdAt desc
    orderBy.push({
      createdAt: 'desc'
    })

    return orderBy
  }
}
