import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}
