import { PartialType } from '@nestjs/mapped-types';
import { BaseRequestDto } from './base-request.dto';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FoodEntity } from '../entities/food.entity';
import { Transform } from 'class-transformer';

export class RequestListFoodDto extends BaseRequestDto {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'id';

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(o => o.value.split(',').map(id => parseInt(id)))
	id: Array<number> = [];
}

export class ResponseListFoodDto extends FoodEntity {}
