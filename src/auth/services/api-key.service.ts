import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ApiKeyRepository } from '../repositories';

@Injectable()
export class ApiKeyService {
  constructor(
    @Inject('ApiKeyRepository')
    private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  /**
   * Genera una nueva API Key para un usuario
   * @param userId ID del usuario
   * @param name Nombre descriptivo de la API Key
   * @param description Descripción opcional
   * @returns La API Key generada
   */
  async generateApiKey(userId: string, name: string, description?: string) {
    // Generar una clave aleatoria segura
    const keyBuffer = randomBytes(32);
    const key = keyBuffer.toString('hex');

    const apiKey = await this.apiKeyRepository.create({
      key,
      name,
      description,
      userId,
    });

    return apiKey;
  }

  /**
   * Valida una API Key
   * @param key La API Key a validar
   * @returns El registro de la API Key si es válida
   * @throws UnauthorizedException si la API Key es inválida o está inactiva
   */
  async validateApiKey(key: string) {
    const apiKey = await this.apiKeyRepository.findByKey(key);

    if (!apiKey || !apiKey.isActive) {
      throw new UnauthorizedException('API Key inválida o inactiva');
    }

    // Actualizar la fecha de último uso
    await this.apiKeyRepository.updateLastUsed(apiKey.id, new Date());

    return apiKey;
  }

  /**
   * Obtiene todas las API Keys de un usuario
   * @param userId ID del usuario
   * @returns Lista de API Keys
   */
  async getApiKeysByUserId(userId: string) {
    return this.apiKeyRepository.findByUserId(userId);
  }

  /**
   * Desactiva una API Key
   * @param id ID de la API Key
   */
  async deactivateApiKey(id: string) {
    const apiKey = await this.apiKeyRepository.deactivate(id);

    if (!apiKey) {
      throw new NotFoundException('API Key no encontrada');
    }

    return apiKey;
  }

  /**
   * Elimina una API Key
   * @param id ID de la API Key
   */
  async deleteApiKey(id: string) {
    await this.apiKeyRepository.delete(id);
  }
}
