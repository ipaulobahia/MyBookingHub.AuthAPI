import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { createHash } from "crypto";
import { PrismaService } from "src/prisma/services/prisma.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create({ cellphone, email, name, password }: CreateOwnerDto | CreateEmployeeDto, role: "OWNER" | "EMPLOYEE") {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.users.create({
      data: {
        cellphone,
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
  }

  async findOrCreateClientByCellphone(cellphone: string) {
    return await this.prisma.users.upsert({
      where: {
        cellphone
      },
      update: {},
      create: {
        name: "",
        cellphone,
        role: "CLIENT"
      }
    })
  }

  async findOwnerOrEmployeeByEmailAndGetPassword(email: string) {
    return await this.prisma.users.findUnique({
      where: { email }
    })
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);

    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: currentHashedRefreshToken
      }
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return null
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken!,
    );

    if (isRefreshTokenMatching) {
      return { sub: user.id, role: user.role, iat: Math.floor(Date.now() / 1000) };
    }
  }
}