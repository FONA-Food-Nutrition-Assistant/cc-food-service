import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import { IsNumber, IsNotEmpty, IsString, IsEmail, IsArray, IsEnum } from 'class-validator';

import { gender } from '../../../common/enum/gender.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  activity: number;

  @IsNotEmpty()
  @IsEnum(gender)
  gender: string;

  @IsString()
  date_of_birth: string;

  @IsString({each: true})
  alergies: string[]
}
