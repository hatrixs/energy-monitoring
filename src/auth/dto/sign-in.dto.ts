import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'Qwerty1234',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  public password: string;
}
