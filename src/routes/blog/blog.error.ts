import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common'
import { Role } from '@prisma/client'

export class BlogNotFoundError extends NotFoundException {
  constructor() {
    super('Blog not found')
  }
}

export class BlogSlugExistsError extends BadRequestException {
  constructor() {
    super('Blog slug already exists')
  }
}

export class BlogUnauthorizedError extends ForbiddenException {
  constructor() {
    super('Only admin users can manage blogs')
  }
}

export class BlogAlreadyPublishedError extends BadRequestException {
  constructor() {
    super('Blog is already published')
  }
}

export class BlogNotPublishedError extends BadRequestException {
  constructor() {
    super('Blog is not published')
  }
}

export function validateBlogPermission(roleName: string) {
  if (roleName !== Role.ADMIN_SYSTEM) {
    throw new BlogUnauthorizedError()
  }
}
