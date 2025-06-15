import { PlanDuration, Prisma } from '@prisma/client'
import { randomInt } from 'crypto'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
// Type Predicate
export function isUniqueConstraintPrismaError(
  error: any
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(
  error: any
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function isForeignKeyConstraintPrismaError(
  error: any
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}

export const generateOTP = () => {
  return String(randomInt(100000, 1000000))
}

export const generateRandomFileName = (fileName: string) => {
  const ext = path.extname(fileName)
  return `${uuidv4()}${ext}`
}

export const mapEnumToDays = (enumValue: PlanDuration) => {
  switch (enumValue) {
    case 'ONE_MONTH':
      return '30'
    case 'THREE_MONTHS':
      return '90'
    case 'SIX_MONTHS':
      return '180'
    case 'ONE_YEAR':
      return '365'
  }
}
