import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { BusinessService } from "../services/business.service";

@ApiTags('business')
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

  @ApiOperation({ summary: 'Crie um estabelecimento' })
  @ApiResponse({ status: 201 })
  @Public()
  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto)
  }
}