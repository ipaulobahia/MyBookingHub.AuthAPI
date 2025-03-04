import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UsersService } from "../services/users.service";

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Crie um usuário com função de proprietário' })
  @ApiResponse({ status: 201 })
  @Post("owner")
  createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.usersService.create(createOwnerDto, "OWNER")
  }

  @ApiOperation({ summary: 'Crie um usuário com função de funcionário' })
  @ApiResponse({ status: 201 })
  @Roles(Role.OWNER)
  @Post("employee")
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.create(createEmployeeDto, "EMPLOYEE")
  }

  @ApiOperation({ summary: 'Busque todos os usuários' })
  @ApiResponse({ status: 200, isArray: true })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @ApiOperation({ summary: 'Busque um usuário pelo seu Id' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Get('/byId/:id')
  findOne(@Param('id') userId: string) {
    return this.usersService.findOne(userId)
  }

  @ApiOperation({ summary: 'Busque um proprietário' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get('owners')
  findAllOwners() {
    return this.usersService.findUsersByRole("OWNER")
  }

  @ApiOperation({ summary: 'Busque um funcionário' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get('employees')
  findAllEmployees() {
    return this.usersService.findUsersByRole("EMPLOYEE")
  }

  @ApiOperation({ summary: 'Busque um cliente pelo seu Id' })
  @ApiResponse({ status: 200, isArray: true })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get('clients')
  findAllClients() {
    return this.usersService.findUsersByRole("CLIENT")
  }

  @ApiOperation({ summary: 'Busque funcionários pelo id do estabelecimento' })
  @ApiResponse({ status: 200, isArray: true })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get('employees/:businessId')
  findEmployeesByBusinessId(@Param('businessId') businessId: string) {
    return this.usersService.findByBusinessAndRole(businessId, "EMPLOYEE")
  }

  @ApiOperation({ summary: 'Busque clientes pelo id do estabelecimento' })
  @ApiResponse({ status: 200, isArray: true })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Get('clients/:businessId')
  findClientsByBusinessId(@Param('businessId') businessId: string) {
    return this.usersService.findByBusinessAndRole(businessId, "CLIENT")
  }
}