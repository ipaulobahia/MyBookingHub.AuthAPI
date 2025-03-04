import { Module } from '@nestjs/common';
import { BusinessService } from 'src/business/services/business.service';
import { SharedRepositoryModule } from 'src/shared/repositories/shared-repository.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [SharedRepositoryModule],
  controllers: [UsersController],
  providers: [UsersService, BusinessService],
})
export class UsersModule { }