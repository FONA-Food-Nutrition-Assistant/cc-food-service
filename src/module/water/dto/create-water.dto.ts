import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseRequestDto } from 'src/module/food/dto/base-request.dto';

export class RequestCreateRecordWaterDto extends BaseRequestDto {
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

export class ResponseCreateRecordWaterDto {
	raw: ResponseRawRecordWaterDto[];
}
