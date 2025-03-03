import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Users } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import config from "src/config";
import { UsersService } from "src/users/services/users.services";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>
  ) { }

  async clientLogin(cellphone: string) {
    const client = await this.usersService.findOrCreateClientByCellphone(cellphone)

    if (!client) {
      throw new BadRequestException("Erro ao realizar o login.")
    }

    const accessToken = this.generateAccessToken(client);
    const refreshToken = this.generateRefreshToken(client);

    await this.usersService.setCurrentRefreshToken(refreshToken, client.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async ownerEmployeLogin(email: string, password: string) {
    const ownerEmployee = await this.usersService.findOwnerOrEmployeeByEmailAndGetPassword(email)

    if (!ownerEmployee || !ownerEmployee.password) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const isMatch = await bcrypt.compare(password, ownerEmployee.password);

    if (!isMatch) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const accessToken = this.generateAccessToken(ownerEmployee);
    const refreshToken = this.generateRefreshToken(ownerEmployee);

    await this.usersService.setCurrentRefreshToken(refreshToken, ownerEmployee.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateTokenPayload(user: Users) {
    return { sub: user.id, role: user.role, iat: Math.floor(Date.now() / 1000) };
  }

  generateAccessToken(user: Users) {
    const payload = this.generateTokenPayload(user);
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(user: Users) {
    const payload = this.generateTokenPayload(user);
    return this.jwtService.sign(payload, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: this.configService.jwt.refreshTokenExpiration,
    });
  }
}