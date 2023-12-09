import { BaseRequestDto } from '../../food/dto/base-request.dto';
import { IsNotEmpty, IsDate, IsString } from 'class-validator';
import { FoodEntity } from '../../food/entities/food.entity';
import { NutritionEntity } from '../../food/entities/nutrition.entity';
import { Req } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class RequestHomeDto extends BaseRequestDto {
	@IsNotEmpty()
	@IsString()
	date: Date;
}

// export class ResponseHomeDto extends BaseRequestDto {
// 	nutritions: Array<NutritionEntity>;
// }
