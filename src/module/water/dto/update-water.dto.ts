import { PartialType } from '@nestjs/mapped-types';
import { CreateWaterDto } from './create-water.dto';

import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateWaterDto extends PartialType(CreateWaterDto) {
	@IsNotEmpty()
	@IsNumber()
	number_of_cups: number;

	@IsNotEmpty()
	@IsString()
	date: string;
}
