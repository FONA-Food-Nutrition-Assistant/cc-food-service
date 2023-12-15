import { PartialType } from '@nestjs/mapped-types';
import { NutritionObjectDto } from './nutrition-object.dto';

import { IsNotEmpty, IsString, IsEnum, ValidateNested } from 'class-validator';
import { Mealtime } from 'src/common/enum/meal_time.enum';
import { Type } from 'class-transformer';
import { BaseRequestDto } from './base-request.dto';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';

export class RequestUpdateRecordFoodDto extends BaseRequestDto {
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

export class ResponseUpdateRecordFoodDto {
	is_foods_contain_allergies: boolean;
	foods_contain_allergies: String[];
	data: Array<UserNutritionEntity>;
}
