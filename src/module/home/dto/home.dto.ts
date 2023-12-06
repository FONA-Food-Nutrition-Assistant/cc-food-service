import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHomeDto {
	@IsNotEmpty()
	@IsString()
	date: string;
}
