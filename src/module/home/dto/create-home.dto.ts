import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHomeDto {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}
