import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OutboxService } from './outbox.service';
import { Transaction } from 'src/shared/schema/transaction.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

export class OutboxProcessor {
  constructor(
    @Inject('transaction_broker')
    private readonly messageBrokerClient: ClientProxy,
    private readonly _outboxService: OutboxService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async process() {
    const messages: Transaction[] =
      await this._outboxService.getUnprocessedTransactions();

    for (const message of messages) {
      try {
        console.log(message);
        await firstValueFrom(
          this.messageBrokerClient.emit('account.transfer', message),
        );
        await this._outboxService.markProcessed(message._id);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
