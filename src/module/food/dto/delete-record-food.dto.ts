import {
	IsNotEmpty,
	IsString,
	IsEnum,
	ValidateNested,
	IsArray,
} from 'class-validator';
import { Mealtime } from 'src/common/enum/meal_time.enum';
import { BaseRequestDto } from './base-request.dto';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';

export class RequestDeleteRecordFoodDto extends BaseRequestDto {
	@IsNotEmpty()
	@IsArray()
	nutrition_ids: Array<number>;

	@IsNotEmpty()
	@IsEnum(Mealtime)
	meal_time: string;

	@IsNotEmpty()
	@IsString()
	date: string;
}
