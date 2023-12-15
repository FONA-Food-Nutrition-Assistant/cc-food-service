import { BaseRequestDto } from '../../food/dto/base-request.dto';
import { IsString, IsOptional } from 'class-validator';

import { Transform } from 'class-transformer';

export class RequestHomeDto extends BaseRequestDto {
	@IsString()
	@IsOptional()
	@Transform(({ value }) =>
		value !== 'undefined'
			? String(value)
			: new Date().toISOString().split('T')[0],
	)
	date?: String;

	constructor() {
		super();
		// Set default value here if not provided in the request
		this.date = new Date().toISOString().split('T')[0];
	}
}

// export class ResponseHomeDto extends BaseRequestDto {
// 	nutritions: Array<NutritionEntity>;
// }
