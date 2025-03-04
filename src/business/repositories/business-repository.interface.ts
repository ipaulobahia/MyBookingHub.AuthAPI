import { CreateBusinessDto } from "../dto/create-business.dto";
import { Business } from "../models/business.model";

export interface IBusinessRepository {
  findAll(): Promise<Business[]>;
  create(createBusinessDto: CreateBusinessDto): Promise<void>
}