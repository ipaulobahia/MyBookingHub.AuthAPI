import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
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
      where: { email }
    });

    if (!user) return null;
    return new AuthUser(user);
  }

  async create(createUserDto: CreateOwnerDto | CreateEmployeeDto, role: "OWNER" | "EMPLOYEE"): Promise<void> {
    const { cellphone, email, name, password } = createUserDto

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

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }
}
