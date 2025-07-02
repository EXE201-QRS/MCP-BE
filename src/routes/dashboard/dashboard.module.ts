import { SharedModule } from '@/shared/shared.module'
import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardRepo } from './dashboard.repo'
import { DashboardService } from './dashboard.service'

@Module({
  imports: [SharedModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepo],
  exports: [DashboardService]
})
export class DashboardModule {}
