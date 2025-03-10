import { ApiKey } from '../interfaces';

export interface CreateApiKeyData {
  key: string;
  name: string;
  description?: string;
  userId: string;
}

export interface ApiKeyRepository {
  create(data: CreateApiKeyData): Promise<ApiKey>;
  findByKey(key: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  deactivate(id: string): Promise<ApiKey>;
  updateLastUsed(id: string, lastUsedAt: Date): Promise<ApiKey>;
  delete(id: string): Promise<void>;
}
