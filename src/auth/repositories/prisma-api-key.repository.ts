import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ApiKey } from '../interfaces';
import {
  ApiKeyRepository,
  CreateApiKeyData,
} from './api-key-repository.interface';

@Injectable()
export class PrismaApiKeyRepository implements ApiKeyRepository {
  private readonly logger = new Logger(PrismaApiKeyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApiKeyData): Promise<ApiKey> {
    try {
      return (await this.prisma.apiKey.create({
        data,
      })) as unknown as ApiKey;
    } catch (error) {
      this.logger.error(
        `Error al crear API Key: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    try {
      const result = await this.prisma.apiKey.findUnique({
        where: { key },
      });
      return result as unknown as ApiKey;
    } catch (error) {
      this.logger.error(
        `Error al buscar API Key: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async findByUserId(userId: string): Promise<ApiKey[]> {
    try {
      const results = await this.prisma.apiKey.findMany({
        where: { userId },
      });
      return results as unknown as ApiKey[];
    } catch (error) {
      this.logger.error(
        `Error al buscar API Keys por userId: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  async deactivate(id: string): Promise<ApiKey> {
    try {
      return (await this.prisma.apiKey.update({
        where: { id },
        data: { isActive: false },
      })) as unknown as ApiKey;
    } catch (error) {
      this.logger.error(
        `Error al desactivar API Key: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateLastUsed(id: string, lastUsedAt: Date): Promise<ApiKey> {
    try {
      return (await this.prisma.apiKey.update({
        where: { id },
        data: { lastUsedAt },
      })) as unknown as ApiKey;
    } catch (error) {
      this.logger.error(
        `Error al actualizar última fecha de uso: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.apiKey.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Error al eliminar API Key: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
