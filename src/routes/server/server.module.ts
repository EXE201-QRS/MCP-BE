import { Module } from '@nestjs/common'
import { ServerController } from './server.controller'
import { ServerRepo } from './server.repo'
import { ServerService } from './server.service'

@Module({
  controllers: [ServerController],
  providers: [ServerService, ServerRepo]
})
export class ServerModule {}
