import { Inject, Injectable } from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { IBusinessRepository } from "../repositories/business-repository.interface";

@Injectable()
export class BusinessService {
  constructor(
    @Inject('BUSINESS_REPOSITORY')
    private readonly businessRepository: IBusinessRepository,
  ) { }

  async findAll() {
    return await this.businessRepository.findAll();
  }

  async create(createBusinessDto: CreateBusinessDto) {
    return await this.businessRepository.create(createBusinessDto)
  }
}