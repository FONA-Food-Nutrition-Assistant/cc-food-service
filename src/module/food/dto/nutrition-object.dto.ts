import { IsNotEmpty, IsNumber } from 'class-validator';

export class NutritionObjectDto {
	@IsNotEmpty()
	@IsNumber()
	nutrition_id: number;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
