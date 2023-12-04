import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordFoodDto } from './create-record_food.dto';
import { FoodDto } from './food.dto';

import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Mealtime } from 'src/common/enum/meal_time.enum';

export class UpdateRecordFoodDto extends PartialType(CreateRecordFoodDto) {
	@IsNotEmpty()
	foods: FoodDto[];

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
