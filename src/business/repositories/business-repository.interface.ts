import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { Business } from "../models/business.model";

export interface IBusinessRepository {
  findAll(): Promise<Business[]>;
  findOne(businessId: string): Promise<Business | null>
  create(createBusinessDto: CreateBusinessDto): Promise<void>
  update(businessId: string, updateBusinessDto: UpdateBusinessDto): Promise<void>
  delete(businessId: string): Promise<void>
}