import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCustomEntity } from './base.entity';

@Entity('account')
export class AccountEntity extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'bigint', nullable: false, unique: true })
  @Column({
    type: 'bigint',
    nullable: false,
    unique: true,
    default: () => "nextval('account_number_seq')",
  })
  accountNumber: number;

  @Column({ type: 'int8', nullable: false })
  balance: number;
}
