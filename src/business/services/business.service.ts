import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
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

  async findOne(businessId: string) {
    return await this.businessRepository.findOne(businessId)
  }

  async create(createBusinessDto: CreateBusinessDto) {
    return await this.businessRepository.create(createBusinessDto)
  }

  async updateBusiness(businessId: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.findOne(businessId)

    if (!business) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }

    return await this.businessRepository.update(businessId, updateBusinessDto)
  }

  async delete(businessId: string) {
    const business = await this.findOne(businessId)

    if (!business) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }

    return await this.businessRepository.delete(businessId)
  }
}