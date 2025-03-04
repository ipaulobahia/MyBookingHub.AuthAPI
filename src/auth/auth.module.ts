import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { UsersService } from 'src/users/services/users.service';
import config from '../config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: 'USERS_REPOSITORY',
      useClass: UsersRepository,
    },
  ],
})
export class AuthModule { }