import { $Enums } from "@prisma/client";

export interface PayloadClientToken {
  id: number;
  role: $Enums.Role;
}