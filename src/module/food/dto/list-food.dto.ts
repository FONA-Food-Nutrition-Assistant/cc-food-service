import { PartialType } from '@nestjs/mapped-types';
import { BaseRequestDto } from './base-request.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class ListFoodDto extends PartialType(BaseRequestDto) {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'id';
}
