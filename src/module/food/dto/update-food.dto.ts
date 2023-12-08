import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import { NutritionObjectDto } from './nutrition-object.dto';

import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Mealtime } from 'src/common/enum/meal_time.enum';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
	@IsNotEmpty()
	foods: NutritionObjectDto[];

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
