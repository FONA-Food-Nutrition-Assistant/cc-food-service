import { IsDate, IsNotEmpty, IsNumber, isDate } from 'class-validator';

export class NutritionObjectDto {
	@IsNotEmpty()
	foods: NutritionObjectDto[];

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
