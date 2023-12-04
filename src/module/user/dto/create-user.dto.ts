import { IsNotEmpty, IsString, IsEmail, IsNumber, IsArray, IsEnum } from 'class-validator';

import { gender } from '../../../common/enum/gender.enum';

export class CreateUserDto {
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