import { PartialType } from '@nestjs/mapped-types';
import { BaseRequestDto } from './base-request.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { NutritionEntity } from '../entities/nutrition.entity';

export class RequestListNutritionDto extends BaseRequestDto {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'id';
}

export class ResponseListNutritionDto extends NutritionEntity {}
