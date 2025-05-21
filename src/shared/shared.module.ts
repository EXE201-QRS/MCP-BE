import { PrismaService } from '@/shared/services/prisma.service'
import { Module } from '@nestjs/common'

const sharedServices = [PrismaService]
@Module({
  controllers: [],
  providers: [...sharedServices]
})
export class SharedModule {}
