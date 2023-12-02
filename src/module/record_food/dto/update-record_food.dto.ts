import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordFoodDto } from './create-record_food.dto';

import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordFoodDto extends PartialType(CreateRecordFoodDto) {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}
