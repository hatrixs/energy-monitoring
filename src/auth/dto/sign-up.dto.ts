import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  public name: string;

  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  public email: string;

  @ApiProperty({
    example: 'John-1234',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  public password: string;
}
