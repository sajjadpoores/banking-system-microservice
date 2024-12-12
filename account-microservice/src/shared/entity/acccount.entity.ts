import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCustomEntity } from './base.entity';

export class AccountEntity extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'int8', nullable: false })
  accountNumber: number;

  @Column({ type: 'int8', nullable: false })
  balance: number;
}
