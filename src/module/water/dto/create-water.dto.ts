import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWaterDto {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}
