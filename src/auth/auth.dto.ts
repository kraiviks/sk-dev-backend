import { IsString, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
