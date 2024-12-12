import { Injectable } from '@nestjs/common';
import { OutboxEntity } from 'src/shared/entity/outbox.entity';
import { OutboxRepository } from 'src/shared/repository/outbox.repository';

@Injectable()
export class OutboxService {
  constructor(private readonly _outboxRepository: OutboxRepository) {}

  async getUnprocessedEvents(): Promise<OutboxEntity[]> {
    return this._outboxRepository.findUnprocessed();
  }

  async markProcessed(id: number): Promise<void> {
    await this._outboxRepository.markAsProcessed(id);
  }
}
