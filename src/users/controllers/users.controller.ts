import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UsersService } from "../services/users.services";

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("owner")
  createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.usersService.create(createOwnerDto, "OWNER")
  }

  @Post("employee")
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.create(createEmployeeDto, "EMPLOYEE")
  }
}