import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

import {
	IsNumber,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';
import { BaseRequestDto } from 'src/module/food/dto/base-request.dto';

export class RequestUpdateRecordWaterDto extends BaseRequestDto {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}

export class ResponseUpdateRecordWaterDto {
	id: number;
	user_id: string;
	number_of_cups: number;
	date: Date;
	created_at: Date;
	updated_at: Date;
}
