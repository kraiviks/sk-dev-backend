import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsString()
  @IsOptional()
  readonly bio?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;
}
