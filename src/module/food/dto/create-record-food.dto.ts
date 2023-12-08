import { IsNotEmpty, IsEnum, IsString, ValidateNested } from 'class-validator';
import { NutritionObjectDto } from './nutrition-object.dto';
import { Mealtime } from 'src/common/enum/meal_time.enum';
import { Type } from 'class-transformer';
import { BaseRequestDto } from './base-request.dto';

export class RequestCreateRecordFoodDto extends BaseRequestDto {
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

export class ResponseCreateRecordFoodDto {
	is_foods_contain_allergies: boolean;
	foods_contain_allergies: String[];
}
