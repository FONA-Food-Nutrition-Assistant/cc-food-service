import { IsNotEmpty, IsEnum, IsString, ValidateNested } from 'class-validator';
import { NutritionObjectDto } from './nutrition-object.dto';
import { Mealtime } from 'src/common/enum/meal_time.enum';
import { Type } from 'class-transformer';
export class CreateFoodDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => NutritionObjectDto)
	foods: NutritionObjectDto[];

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
