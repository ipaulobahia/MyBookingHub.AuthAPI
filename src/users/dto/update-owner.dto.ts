import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateOwnerDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly cellphone: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;
}