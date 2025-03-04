import { ApiProperty } from "@nestjs/swagger";
import { BusinessType } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateBusinessDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly cellphone: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsEnum(BusinessType)
  readonly type: BusinessType;
}