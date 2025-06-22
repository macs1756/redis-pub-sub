import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageListener } from './messages-listener.service';
import { SocketModule } from 'src/ws/events.module';

@Module({
  imports: [SocketModule],
  controllers: [MessagesController, MessageListener],
  providers: [MessagesService],
})
export class MessagesModule {}
