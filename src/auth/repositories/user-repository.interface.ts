import { User } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UserRepository {
  create(userData: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
