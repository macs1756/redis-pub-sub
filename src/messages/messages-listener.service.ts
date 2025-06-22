import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SocketGateway } from 'src/ws/events.gateway';

@Controller()
export class MessageListener {
  constructor(private readonly sockerGateway: SocketGateway) {}

  @EventPattern('brick1')
  handleMessage(data: any) {
    console.log(data);
    //  this.eventsGateway.sendToClients('brick1', 'test');
    this.sockerGateway.sendToClients('brick1', data);
  }
}
