import { Role } from "@prisma/client"
import { CreateEmployeeDto } from "../dto/create-employee.dto"
import { CreateOwnerDto } from "../dto/create-owner.dto"
import { User } from "../entities/user.entity"

export interface IUsersRepository {
  findAll(): Promise<User[]>
  findUsersByRole(role: Role): Promise<User[]>
  findOne(userId: string): Promise<User | null>
  findByBusinessAndRole(businessId: string, role: Role): Promise<User[]>
  findOrCreateClientByCellphone(cellphone: string): Promise<User>
  findOwnerOrEmployeeByEmailAndGetPassword(email: string): Promise<User | null>
  create(createUserDto: CreateOwnerDto | CreateEmployeeDto, role: "OWNER" | "EMPLOYEE"): Promise<void>
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>
}