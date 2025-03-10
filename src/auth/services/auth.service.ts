import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from '../dto';
import { JwtPayload } from '../interfaces';
import { UserRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const { password, ...userData } = signUpDto;

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      // Eliminar la contraseña del objeto de respuesta
      const { password: _, ...userWithoutPassword } = user;

      // Generar el JWT
      return {
        user: userWithoutPassword,
        token: this.getJwtToken({ id: user.id, email: user.email }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === 'P2002') {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    console.error(error);
    throw new InternalServerErrorException('Error interno del servidor');
  }
}
