import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { UserRepository } from '../repositories';
import { ApiKeyService } from '../services/api-key.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const apiKey = this.extractKeyFromRequest(req);

    if (!apiKey) {
      throw new UnauthorizedException('API Key requerida');
    }

    try {
      // Validar la API Key
      const apiKeyRecord = await this.apiKeyService.validateApiKey(apiKey);

      // Obtener el usuario asociado a la API Key
      const user = await this.userRepository.findById(apiKeyRecord.userId);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Devolver el usuario y la información de la API Key
      return {
        user,
        apiKey: apiKeyRecord,
      };
    } catch (_error) {
      throw new UnauthorizedException('API Key inválida');
    }
  }

  private extractKeyFromRequest(req: Request): string | undefined {
    // Primero buscar en el header 'x-api-key'
    const apiKey = req.headers['x-api-key'];

    if (apiKey && typeof apiKey === 'string') {
      return apiKey;
    }

    // Luego buscar en el Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }

    // Finalmente buscar en los query params
    if (req.query && req.query.apiKey) {
      return req.query.apiKey as string;
    }

    return undefined;
  }
}
