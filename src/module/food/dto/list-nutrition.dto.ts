import { PartialType } from '@nestjs/mapped-types';
import { BaseRequestDto } from './base-request.dto';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { NutritionEntity } from '../entities/nutrition.entity';
import { Transform } from 'class-transformer';

export class RequestListNutritionDto extends BaseRequestDto {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'id';

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(o => o.value.split(',').map(id => parseInt(id)))
	id: Array<number> = [];

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(o => o.value.split(',').map(id => parseInt(id)))
	food_id: Array<number> = [];
}

export class ResponseListNutritionDto extends NutritionEntity {}
