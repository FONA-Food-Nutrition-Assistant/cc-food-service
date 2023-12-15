import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { BaseRequestDto } from '../../food/dto/base-request.dto';
import { AllergyEntity } from 'src/module/food/entities/allergy.entity';

export class RequestListAllergyDto extends BaseRequestDto {
	@IsOptional()
	@IsEnum(['id', 'name'])
	sort: 'id' | 'name' = 'id';

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Transform(o => o.value.split(',').map(id => parseInt(id)))
	id: Array<number> = [];
}

export class ResponseListAllergyDto extends AllergyEntity {}
