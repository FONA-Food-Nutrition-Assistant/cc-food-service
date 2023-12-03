import { IsDate, IsNotEmpty, IsNumber, isDate } from 'class-validator';

export class FoodDto {
	@IsNotEmpty()
	foods: FoodDto[];

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
