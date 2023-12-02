/* Nestjs Dependencies */
import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	HttpStatus,
	Headers,
} from '@nestjs/common';
// import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { RecordFoodService } from './record_food.service';

/* DTO */
import { CreateRecordFoodDto } from './dto/create-record_food.dto';
import { UpdateRecordFoodDto } from './dto/update-record_food.dto';

@Controller('food')
export class RecordFoodController {
	constructor(private readonly recordFoodService: RecordFoodService) {}

	@Post()
	async storeRecordFood(
		@Body() params: CreateRecordFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.recordFoodService.recordFood(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	// @Put()
	// async updateWater(
	// 	@Body() params: UpdateRecordFoodDto,
	// 	@Headers('fona-client-uid') uid: string,
	// ) {
	// 	const data = await this.waterService.updateWaterById(params, uid);
	// 	return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	// }
}
