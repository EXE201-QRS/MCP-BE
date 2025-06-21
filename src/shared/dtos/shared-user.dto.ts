import { GetAccountProfileResSchema } from '@/routes/auth/auth.model'
import { createZodDto } from 'nestjs-zod'

export class GetAccountProfileResDTO extends createZodDto(GetAccountProfileResSchema) {}
