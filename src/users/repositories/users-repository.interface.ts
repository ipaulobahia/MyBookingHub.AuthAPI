import { Role } from "@prisma/client"
import { CreateEmployeeDto } from "../dto/create-employee.dto"
import { CreateOwnerDto } from "../dto/create-owner.dto"
import { UpdateClientDto } from "../dto/update-client.dto"
import { UpdateEmployeeDto } from "../dto/update-employee.dto"
import { UpdateOwnerDto } from "../dto/update-owner.dto"
import { User } from "../entities/user.entity"

export interface IUsersRepository {
  findAll(): Promise<User[]>
  findUsersByRole(role: Role): Promise<User[]>
  findOne(userId: string): Promise<User | null>
  findOneByEmail(userId: string, email: string): Promise<User | null>
  findOneByCellphone(userId: string, cellphone: string): Promise<User | null>
  findByBusinessAndRole(businessId: string, role: Role): Promise<User[]>
  findOrCreateClientByCellphone(cellphone: string): Promise<User>
  findOwnerOrEmployeeByEmailAndGetPassword(email: string): Promise<User | null>
  createOwner(createUserDto: CreateOwnerDto): Promise<void>
  createEmployee(createUserDto: CreateEmployeeDto): Promise<void>
  updateOwner(ownerId: string, updateOwnerDto: UpdateOwnerDto): Promise<void>
  updateEmployee(employeeId: string, updateEmployeeDto: UpdateEmployeeDto): Promise<void>
  updateClient(clientId: string, updateClientDto: UpdateClientDto): Promise<void>
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>
  delete(userId: string): Promise<void>
}