import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para obtener la información de la API Key del request
 */
export const GetApiKey = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.apiKey;
  },
);
