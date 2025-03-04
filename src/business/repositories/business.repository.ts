import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { IUsersRepository } from "src/users/repositories/users-repository.interface";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { Business } from "../models/business.model";
import { IBusinessRepository } from "./business-repository.interface";

@Injectable()
export class BusinessRepository implements IBusinessRepository {
  constructor(
    private prisma: PrismaService,
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
  ) { }

  async findAll(): Promise<Business[]> {
    return await this.prisma.business.findMany({
      include: {
        owner: {
          omit: {
            password: true,
            refreshToken: true,
            role: true,
            employeeBusinessId: true
          }
        }
      },
      omit: {
        ownerId: true
      }
    })
  }

  async create(createBusinessDto: CreateBusinessDto): Promise<void> {
    const { ownerId, address, cellphone, cnpj, name, type } = createBusinessDto

    const owner = await this.usersRepository.findOne(ownerId)

    if (!owner) {
      throw new NotFoundException('Proprietário não encontrado')
    }

    await this.prisma.business.create({
      data: {
        address,
        cellphone,
        cnpj,
        name,
        type,
        owner: { connect: { id: ownerId } }
      }
    })
  }
}