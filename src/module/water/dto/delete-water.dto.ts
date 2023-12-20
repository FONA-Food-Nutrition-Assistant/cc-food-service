import {
	IsNumber,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';
import { BaseRequestDto } from 'src/module/food/dto/base-request.dto';

export class RequestDeleteRecordWaterDto extends BaseRequestDto {
	@IsNotEmpty()
	@IsString()
	date: string;
}
