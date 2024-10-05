import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { RegisterDto } from '../../auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty()
  username: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  avatar: string;
}
