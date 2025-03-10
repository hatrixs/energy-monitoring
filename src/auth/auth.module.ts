import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from '../config';
import { ApiKeyController } from './controllers/api-key.controller';
import { AuthController } from './controllers/auth.controller';
import { PrismaApiKeyRepository, PrismaUserRepository } from './repositories';
import { ApiKeyService } from './services/api-key.service';
import { AuthService } from './services/auth.service';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController, ApiKeyController],
  providers: [
    AuthService,
    ApiKeyService,
    JwtStrategy,
    ApiKeyStrategy,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ApiKeyRepository',
      useClass: PrismaApiKeyRepository,
    },
  ],
  exports: [JwtStrategy, ApiKeyStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
