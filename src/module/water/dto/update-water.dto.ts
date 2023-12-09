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

class ResponseRawRecordWaterDto {
	id: number;
	user_id: string;
	number_of_cups: number;
	date: string;
	created_at: string;
	updated_at: string;
}

export class ResponseUpdateRecordWaterDto {
	raw: ResponseRawRecordWaterDto[];
}
