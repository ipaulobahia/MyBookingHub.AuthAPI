import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ClientLoginDto } from "../dto/client-login.dto";
import { OwnerEmployeeLoginDto } from "../dto/owner-employee-login.dto";
import { PostLoginResponse } from "../dto/response-login.dto";
import { AuthService } from "../services/auth.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiBody({ type: OwnerEmployeeLoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @HttpCode(200)
  @Post('owner-employee-login')
  OwnerEmployeLogin(@Body() { email, password }: OwnerEmployeeLoginDto) {
    return this.authService.ownerEmployeLogin(email, password);
  }

  @ApiBody({ type: ClientLoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @HttpCode(200)
  @Post('client-login')
  ClientLogin(@Body() { cellphone }: ClientLoginDto) {
    return this.authService.clientLogin(cellphone);
  }
}