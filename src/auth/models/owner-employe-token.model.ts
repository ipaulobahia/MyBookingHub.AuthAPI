import { $Enums } from "@prisma/client";

export interface PayloadOwnerEmployeToken {
  id: number;
  role: $Enums.Role;
}