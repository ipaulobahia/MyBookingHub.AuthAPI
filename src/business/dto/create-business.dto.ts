import { ApiProperty } from "@nestjs/swagger";
import { BusinessType } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreateBusinessDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly cnpj: string;

  @ApiProperty()
  @IsString()
  readonly cellphone: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsEnum(BusinessType)
  readonly type: BusinessType;

  @ApiProperty()
  @IsString()
  readonly ownerId: string;
}