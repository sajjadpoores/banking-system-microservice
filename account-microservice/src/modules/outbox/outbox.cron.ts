import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { OutboxEntity } from 'src/shared/entity/outbox.entity';
import { TransferType } from 'src/shared/enum/transfer-type.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OutboxProcessor {
  constructor(
    @Inject('account_broker')
    private readonly messageBrokerClient: ClientProxy,
    private readonly _outboxService: OutboxService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async process() {
    const messages: OutboxEntity[] =
      await this._outboxService.getUnprocessedEvents();

    for (const message of messages) {
      try {
        if (
          message.type === TransferType.TRANSFER ||
          message.type === TransferType.HARD_TRANSFER
        ) {
          await firstValueFrom(
            this.messageBrokerClient.emit('transfer.done', message.payload),
          );
        }
        await this._outboxService.markProcessed(message.id);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
