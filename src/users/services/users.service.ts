import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { createHash } from "crypto";
import { BusinessService } from "src/business/services/business.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UpdateClientDto } from "../dto/update-client.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { UpdateOwnerDto } from "../dto/update-owner.dto";
import { IUsersRepository } from "../repositories/users-repository.interface";

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
    private readonly businessService: BusinessService,
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

  async findOwnerOrEmployeeByEmailToAuth(email: string) {
    return await this.usersRepository.findOwnerOrEmployeeByEmailAndGetPassword(email)
  }

  async createOwner({ cellphone, email, name, password }: CreateOwnerDto) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.createOwner({
      cellphone,
      email,
      name,
      password: hashedPassword,
      role: "OWNER"
    })
  }

  async createEmployee({ cellphone, email, name, password, employeeBusinessId }: CreateEmployeeDto) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const business = await this.businessService.findOne(employeeBusinessId)

    if (!business) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }

    return await this.usersRepository.createEmployee({
      cellphone,
      email,
      name,
      password: hashedPassword,
      role: "CLIENT",
      employeeBusinessId
    })
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

  async updateOwner(ownerId: string, updateOwnerDto: UpdateOwnerDto) {
    const owner = await this.usersRepository.findOne(ownerId)

    if (!owner) {
      throw new NotFoundException('Proprietário não encontrado')
    }

    const { email, cellphone } = updateOwnerDto

    const checkExistUserByEmail = await this.usersRepository.findOneByEmail(owner.id, email)

    if (checkExistUserByEmail) {
      throw new ConflictException('Este e-mail já está em uso')
    }

    const checkExistUserByCellhone = await this.usersRepository.findOneByCellphone(owner.id, cellphone)

    if (checkExistUserByCellhone) {
      throw new ConflictException('Este número de celular já está em uso')
    }

    return await this.usersRepository.updateOwner(ownerId, updateOwnerDto)
  }

  async updateEmployee(employeeId: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.usersRepository.findOne(employeeId)

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado')
    }

    const { email, cellphone } = updateEmployeeDto

    const checkExistUserByEmail = await this.usersRepository.findOneByEmail(employee.id, email)

    if (checkExistUserByEmail) {
      throw new ConflictException('Este e-mail já está em uso')
    }

    const checkExistUserByCellhone = await this.usersRepository.findOneByCellphone(employee.id, cellphone)

    if (checkExistUserByCellhone) {
      throw new ConflictException('Este número de celular já está em uso')
    }

    return await this.usersRepository.updateEmployee(employeeId, updateEmployeeDto)
  }

  async updateClient(clientId: string, updateClientDto: UpdateClientDto) {
    const client = await this.usersRepository.findOne(clientId)

    if (!client) {
      throw new NotFoundException('Cliente não encontrado')
    }

    const { cellphone } = updateClientDto

    const checkExistUserByCellhone = await this.usersRepository.findOneByCellphone(client.id, cellphone)

    if (checkExistUserByCellhone) {
      throw new ConflictException('Este número de celular já está em uso')
    }

    return await this.usersRepository.updateClient(clientId, updateClientDto)
  }

  async delete(userId: string) {
    const user = await this.usersRepository.findOne(userId)

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return await this.usersRepository.delete(userId)
  }
}