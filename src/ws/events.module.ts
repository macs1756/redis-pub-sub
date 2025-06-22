import { Module } from '@nestjs/common';
import { SocketGateway } from './events.gateway';
import { SocketService } from './events.service';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
