import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FoodDto } from './food.dto';

export class CreateRecordFoodDto {
	@IsNotEmpty()
	foods: FoodDto[]

	@IsNotEmpty()
	@IsString()
	date: string;
}
