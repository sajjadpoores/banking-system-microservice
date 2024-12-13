import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransferType } from '../enum/transfer-type.enum';

@Entity('outbox')
export class OutboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  aggregateId: string;

  @Column({ type: 'varchar', nullable: false })
  type: TransferType;

  @Column({ type: 'json', nullable: false })
  payload: any;

  @Column({ type: 'boolean', default: false })
  processed: boolean;
}
