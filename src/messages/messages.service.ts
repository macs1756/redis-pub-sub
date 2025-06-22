import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class MessagesService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'redis',
        port: 6379,
      },
    });
  }

  async create(dto: CreateMessageDto) {
    const { text } = dto;
    await this.client.emit('brick1', text);
    return { message: 'Message was delivered2' };
  }
}
