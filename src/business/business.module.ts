import { Module } from "@nestjs/common";
import { UsersRepository } from "src/users/repositories/users.repository";
import { BusinessController } from "./controllers/business.controller";
import { BusinessRepository } from "./repositories/business.repository";
import { BusinessService } from "./services/business.service";

@Module({
  controllers: [BusinessController],
  providers: [
    BusinessService,
    {
      provide: 'BUSINESS_REPOSITORY',
      useClass: BusinessRepository,
    },
    {
      provide: 'USERS_REPOSITORY',
      useClass: UsersRepository,
    },
  ]
})
export class BusinessModule { }