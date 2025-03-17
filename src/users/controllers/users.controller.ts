import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UpdateClientDto } from "../dto/update-client.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { UpdateOwnerDto } from "../dto/update-owner.dto";
import { UsersService } from "../services/users.service";

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
  @Public()
  @Get(':id')
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

  @ApiOperation({ summary: 'Busque um cliente' })
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

  @ApiOperation({ summary: 'Crie um usuário com função de proprietário' })
  @ApiResponse({ status: 201 })
  @ApiBearerAuth('access-token')
  @Post("owner")
  createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.usersService.createOwner(createOwnerDto)
  }

  @ApiOperation({ summary: 'Crie um usuário com função de funcionário' })
  @ApiResponse({ status: 201 })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Post("employee")
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.createEmployee(createEmployeeDto)
  }

  @ApiOperation({ summary: 'Edita um proprietário' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER)
  @Put('owner/:id')
  updateOwner(@Param('id') ownerId: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.usersService.updateOwner(ownerId, updateOwnerDto)
  }

  @ApiOperation({ summary: 'Edita um funcionário' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Roles(Role.OWNER, Role.EMPLOYEE)
  @Put('employee/:id')
  updateEmployee(@Param('id') employeeId: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.usersService.updateEmployee(employeeId, updateEmployeeDto)
  }

  @ApiOperation({ summary: 'Edita um cliente' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Put('client/:id')
  updateClient(@Param('id') clientId: string, @Body() updateClientDto: UpdateClientDto) {
    return this.usersService.updateClient(clientId, updateClientDto)
  }

  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}