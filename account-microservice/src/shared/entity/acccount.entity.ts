import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCustomEntity } from './base.entity';

@Entity('account')
export class AccountEntity extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({
    type: 'bigint',
    nullable: false,
    unique: true,
    default: () => "nextval('account_number_seq')",
  })
  accountNumber: number;

  @Column({ type: 'int', nullable: false })
  balance: number;

  @Column({ type: 'timestamp', nullable: true })
  lastHardTransferDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastDepositDate: Date | null;

  @Column({ type: 'int', nullable: false, default: 0 })
  todayDepositSum: number;
}
