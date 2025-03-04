import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { Business } from "../models/business.model";
import { IBusinessRepository } from "./business-repository.interface";

@Injectable()
export class BusinessRepository implements IBusinessRepository {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<Business[]> {
    return await this.prisma.business.findMany({
      where: { isActive: true },
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
      omit: { ownerId: true }
    })
  }

  async findOne(businessId: string): Promise<Business | null> {
    return await this.prisma.business.findUnique({
      where: { id: businessId, isActive: true },
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
      omit: { ownerId: true }
    })
  }

  async create(createBusinessDto: CreateBusinessDto): Promise<void> {
    const { ownerId, address, cellphone, cnpj, name, type } = createBusinessDto

    const owner = await this.prisma.users.findUnique({
      where: { id: ownerId },
      select: { id: true }
    });

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

  async update(businessId: string, { address, cellphone, name, type }: UpdateBusinessDto): Promise<void> {
    await this.prisma.business.update({
      where: { id: businessId },
      data: {
        address,
        cellphone,
        name,
        type
      }
    })
  }

  async delete(businessId: string): Promise<void> {
    await this.prisma.business.update({
      where: { id: businessId },
      data: {
        isActive: false,
        deletedAt: new Date()
      }
    })
  }
}