import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Users } from "@prisma/client";

export class OwnerEntity implements Pick<Users, "id" | "name" | "cellphone" | "email" | "password" | "role" | "avatar" | "createdAt" | "updatedAt"> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cellphone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}