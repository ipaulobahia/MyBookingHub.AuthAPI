import { $Enums, Users } from "@prisma/client";

class BaseUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string | null;
  password: string | null;
  cellphone: string;
  avatar: string | null;
  refreshToken: string | null;
  role: $Enums.Role;

  constructor(partial: Partial<BaseUser>) {
    Object.assign(this, partial);
  }
}

export class User extends BaseUser {
  constructor(partial: Partial<User>) {
    super(partial);
  }

  static fromDatabaseUser(PrismaUser: Users): User {
    const { password, refreshToken, ...userWithoutSensitiveInfo } = PrismaUser;
    return new User(userWithoutSensitiveInfo);
  }
}

export class AuthUser extends BaseUser {
  password: string | null;
  refreshToken: string | null;

  constructor(partial: Partial<AuthUser>) {
    super(partial);
    this.password = partial.password ?? null;
    this.refreshToken = partial.refreshToken ?? null;
  }
}