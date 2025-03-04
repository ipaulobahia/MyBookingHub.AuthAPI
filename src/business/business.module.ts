import { Module } from "@nestjs/common";
import { SharedRepositoryModule } from "src/shared/repositories/shared-repository.module";
import { BusinessController } from "./controllers/business.controller";
import { BusinessService } from "./services/business.service";

@Module({
  imports: [SharedRepositoryModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule { }