import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Users } from "@prisma/client";

export class ClientEntity implements Pick<Users, "id" | "name" | "cellphone" | "role" | "createdAt" | "updatedAt"> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cellphone: string;

  @ApiProperty()
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}