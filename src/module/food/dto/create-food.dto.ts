import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { FoodDto } from './food.dto';
import { Mealtime } from 'src/common/enum/meal_time.enum';
export class CreateFoodDto {
	@IsNotEmpty()
	foods: FoodDto[];

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
