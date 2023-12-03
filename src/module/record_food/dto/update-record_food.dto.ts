import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordFoodDto } from './create-record_food.dto';
import { FoodDto } from './food.dto';

import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordFoodDto extends PartialType(CreateRecordFoodDto) {
	@IsNotEmpty()
	foods: FoodDto[]

	@IsNotEmpty()
	@IsString()
	date: string;
}
