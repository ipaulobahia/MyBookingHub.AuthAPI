import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UpdateClientDto } from "../dto/update-client.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { UpdateOwnerDto } from "../dto/update-owner.dto";
import { AuthUser, User } from "../entities/user.entity";
import { IUsersRepository } from "./users-repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.users.findMany();
    return users.map(User.fromDatabaseUser);
  }

  async findOne(userId: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return User.fromDatabaseUser(user);
  }

  async findOneByEmail(userId: string, email: string): Promise<User | null> {
    return await this.prisma.users.findUnique({
      where: {
        email,
        NOT: {
          id: userId
        }
      },
    })
  }

  async findOneByCellphone(userId: string, cellphone: string): Promise<User | null> {
    return await this.prisma.users.findUnique({
      where: {
        cellphone,
        NOT: {
          id: userId
        }
      },
    })
  }

  async findUsersByRole(role: Role): Promise<User[]> {
    const users = await this.prisma.users.findMany({
      where: { role }
    });

    return users.map(User.fromDatabaseUser);
  }

  async findByBusinessAndRole(businessId: string, role: Role): Promise<User[]> {
    let whereCondition: any = { role };

    switch (role) {
      case Role.EMPLOYEE:
        whereCondition = {
          ...whereCondition,
          employeeBusinessId: businessId
        };
        break;
      case Role.CLIENT:
        whereCondition = {
          ...whereCondition,
          clientBusinesses: {
            some: { id: businessId },
          },
        };
        break;
      case Role.OWNER:
        whereCondition = {
          ...whereCondition,
          businessesOwned: {
            some: { id: businessId },
          },
        };
        break;
      default:
        throw new Error('Role inválido');
    }

    const users = await this.prisma.users.findMany({
      where: whereCondition
    });

    return users.map(User.fromDatabaseUser);
  }

  async findOrCreateClientByCellphone(cellphone: string): Promise<User> {
    const user = await this.prisma.users.upsert({
      where: { cellphone },
      update: {},
      create: {
        name: "",
        cellphone,
        role: Role.CLIENT
      }
    });

    return User.fromDatabaseUser(user);
  }

  async findOwnerOrEmployeeByEmailAndGetPassword(email: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) return null;
    return new AuthUser(user);
  }

  async createOwner(createUserDto: CreateOwnerDto): Promise<void> {
    const { cellphone, email, name, password } = createUserDto

    await this.prisma.users.create({
      data: {
        cellphone,
        name,
        email,
        password,
        role: 'OWNER',
      },
    });
  }

  async createEmployee(createUserDto: CreateEmployeeDto): Promise<void> {
    const { cellphone, email, name, password, role, employeeBusinessId } = createUserDto

    await this.prisma.users.create({
      data: {
        cellphone,
        name,
        email,
        password,
        role,
      },
    });
  }

  async updateOwner(ownerId: string, updateOwnerDto: UpdateOwnerDto): Promise<void> {
    const { name, cellphone, avatar, email } = updateOwnerDto

    await this.prisma.users.update({
      where: { id: ownerId },
      data: {
        name,
        cellphone
      }
    })
  }

  async updateEmployee(employeeId: string, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
    const { name, cellphone, avatar, email } = updateEmployeeDto

    await this.prisma.users.update({
      where: { id: employeeId },
      data: {
        name,
        cellphone,
        avatar,
        email
      }
    })
  }

  async updateClient(clientId: string, updateClientDto: UpdateClientDto): Promise<void> {
    const { name, cellphone } = updateClientDto

    await this.prisma.users.update({
      where: { id: clientId },
      data: {
        name,
        cellphone
      }
    })
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id: userId }
    })
  }
}
