import { Module } from "@nestjs/common";
import { BusinessRepository } from "src/business/repositories/business.repository";
import { UsersRepository } from "src/users/repositories/users.repository";

@Module({
  providers: [
    {
      provide: 'USERS_REPOSITORY',
      useClass: UsersRepository,
    },
    {
      provide: 'BUSINESS_REPOSITORY',
      useClass: BusinessRepository,
    },
  ],
  exports: [
    'USERS_REPOSITORY',
    'BUSINESS_REPOSITORY',
  ],
})
export class SharedRepositoryModule { }