import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { NutritionObjectDto } from './nutrition-object.dto';
import { Mealtime } from 'src/common/enum/meal_time.enum';
export class CreateFoodDto {
	@IsNotEmpty()
	foods: NutritionObjectDto[];

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
