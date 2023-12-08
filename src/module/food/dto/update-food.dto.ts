import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import { NutritionObjectDto } from './nutrition-object.dto';

import { IsNotEmpty, IsString, IsEnum, ValidateNested } from 'class-validator';
import { Mealtime } from 'src/common/enum/meal_time.enum';
import { Type } from 'class-transformer';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
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
