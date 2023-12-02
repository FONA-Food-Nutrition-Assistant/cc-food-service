import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordWaterDto } from './create-record_water.dto';

import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordWaterDto extends PartialType(CreateRecordWaterDto) {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}
