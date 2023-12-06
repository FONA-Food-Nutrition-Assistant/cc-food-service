import { BaseRequestDto } from './base-request.dto';
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { FoodEntity } from '../entities/food.entity';
import { NutritionEntity } from '../entities/nutrition.entity';
import { Req } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class RequestFoodDetailDto extends BaseRequestDto {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'name';

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(o => o.value.split(',').map(id => parseInt(id)))
	id: Array<number> = [];
}

export class ResponseFoodDetailDto extends FoodEntity {
	nutritions: Array<NutritionEntity>;
}
