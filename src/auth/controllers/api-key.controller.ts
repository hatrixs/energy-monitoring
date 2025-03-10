import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../decorators';
import { CreateApiKeyDto } from '../dto';
import { ApiKeyService } from '../services/api-key.service';

@ApiTags('API Keys')
@Controller('api-keys')
@Auth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva API Key' })
  @ApiResponse({ status: 201, description: 'API Key creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async createApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @GetUser() user: any,
  ) {
    const apiKey = await this.apiKeyService.generateApiKey(
      user.id,
      createApiKeyDto.name,
      createApiKeyDto.description,
    );

    return {
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Only show the key once when creating it
      description: apiKey.description,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las API Keys del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de API Keys' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getApiKeys(@GetUser() user: any) {
    const apiKeys = await this.apiKeyService.getApiKeysByUserId(user.id);

    return apiKeys.map((apiKey) => ({
      id: apiKey.id,
      name: apiKey.name,
      description: apiKey.description,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      lastUsedAt: apiKey.lastUsedAt,
    }));
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar una API Key' })
  @ApiResponse({ status: 200, description: 'API Key desactivada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'API Key no encontrada' })
  async deactivateApiKey(@Param('id') id: string) {
    return this.apiKeyService.deactivateApiKey(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una API Key' })
  @ApiResponse({ status: 200, description: 'API Key eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'API Key no encontrada' })
  async deleteApiKey(@Param('id') id: string) {
    await this.apiKeyService.deleteApiKey(id);
    return { message: 'API Key eliminada exitosamente' };
  }
}
