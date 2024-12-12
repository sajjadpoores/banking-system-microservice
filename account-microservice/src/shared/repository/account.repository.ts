import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entity/acccount.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class AccountRepository extends Repository<AccountEntity> {
  constructor(@InjectDataSource() DataSource: DataSource) {
    super(AccountEntity, DataSource.createEntityManager());
  }
}
