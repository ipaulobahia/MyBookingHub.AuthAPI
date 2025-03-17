import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { UpdateBusinessDto } from "../dto/update-business.dto";
import { BusinessService } from "../services/business.service";

@ApiTags('Business')
@Controller('business')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) { }

  @ApiOperation({ summary: 'Busque todos os estabelecimentos' })
  @ApiResponse({ status: 200, isArray: true })
  @ApiBearerAuth('access-token')
  @Get()
  findAll() {
    return this.businessService.findAll()
  }

  @ApiOperation({ summary: 'Busque um estabelecimento pelo seu id' })
  @ApiResponse({ status: 200, isArray: true })
  @Public()
  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.businessService.findOne(userId)
  }

  @ApiOperation({ summary: 'Crie um estabelecimento' })
  @ApiResponse({ status: 201 })
  @Public()
  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto)
  }

  @ApiOperation({ summary: 'Edita um estabelecimento' })
  @ApiResponse({ status: 201 })
  @ApiBearerAuth('access-token')
  @Put(':id')
  update(@Param('id') businessId: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.updateBusiness(businessId, updateBusinessDto)
  }

  @ApiOperation({ summary: 'Deleta um estabelecimento' })
  @ApiResponse({ status: 201 })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  delete(@Param('id') businessId: string) {
    return this.businessService.delete(businessId)
  }
}