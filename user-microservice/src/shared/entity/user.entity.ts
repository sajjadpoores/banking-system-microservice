import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCustomEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  userId: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;
}
