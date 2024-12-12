import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { OutboxEntity } from '../entity/outbox.entity';

export class OutboxRepository extends Repository<OutboxEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(OutboxEntity, dataSource.createEntityManager());
  }

  async findUnprocessed(): Promise<OutboxEntity[]> {
    return this.find({ where: { processed: false } });
  }

  async markAsProcessed(id: number): Promise<void> {
    await this.update(id, { processed: true });
  }
}
