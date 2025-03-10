export interface ApiKey {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date | null;
  userId: string;
}
