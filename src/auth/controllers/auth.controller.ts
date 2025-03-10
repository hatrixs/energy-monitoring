import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../decorators';
import { SignInDto, SignUpDto } from '../dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createUser(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente',
  })
  @ApiResponse({ status: 401, description: 'Credenciales no válidas' })
  loginUser(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('refresh-token')
  @Auth()
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token no válido' })
  checkAuthStatus(@GetUser() user: any) {
    return {
      user,
      token: this.authService.getJwtToken({ id: user.id, email: user.email }),
    };
  }
}
