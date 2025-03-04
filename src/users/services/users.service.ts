import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { createHash } from "crypto";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { IUsersRepository } from "../repositories/users-repository.interface";

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
  ) { }

  async findAll() {
    return await this.usersRepository.findAll()
  }

  async findUsersByRole(role: Role) {
    return await this.usersRepository.findUsersByRole(role)
  }

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne(userId)

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return user
  }

  async findByBusinessAndRole(businessId: string, role: Role) {
    return await this.usersRepository.findByBusinessAndRole(businessId, role)
  }

  async create({ cellphone, email, name, password }: CreateOwnerDto | CreateEmployeeDto, role: "OWNER" | "EMPLOYEE") {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.create({
      cellphone,
      email,
      name,
      password: hashedPassword
    }, role)
  }

  async findOrCreateClientByCellphone(cellphone: string) {
    return await this.usersRepository.findOrCreateClientByCellphone(cellphone)
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);

    await this.usersRepository.updateRefreshToken(userId, currentHashedRefreshToken)
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.usersRepository.findOne(userId)

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