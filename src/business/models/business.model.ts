import { $Enums } from "@prisma/client";

class BusinessOwner {
  id: string;
  name: string;
  email: string | null;
  cellphone: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<BusinessOwner>) {
    Object.assign(this, partial);
  }
}

export class Business {
  type: $Enums.BusinessType;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cellphone: string;
  cnpj: string;
  address: string;
  owner: BusinessOwner;

  constructor(partial: Partial<Business>) {
    Object.assign(this, partial);
  }
}