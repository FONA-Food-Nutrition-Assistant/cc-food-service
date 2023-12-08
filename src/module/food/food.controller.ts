/* Nestjs Dependencies */
import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	HttpStatus,
	Headers,
	Query,
} from '@nestjs/common';
// import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { FoodService } from './food.service';

/* DTO */
import { RequestUpdateRecordFoodDto } from './dto/update-record-food.dto';
import { RequestListFoodDto } from './dto/list-food.dto';
import { RequestListNutritionDto } from './dto/list-nutrition.dto';
import { RequestFoodDetailDto } from './dto/food-detail.dto';
import { RequestCreateRecordFoodDto } from './dto/create-record-food.dto';

@Controller('food')
export class FoodController {
	constructor(private readonly foodService: FoodService) {}

	@Get()
	async getFood(
		@Query() params: RequestListFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.foodService.getFood(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}

	@Get('detail')
	async getFoodDetail(
		@Query() params: RequestFoodDetailDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.foodService.getFoodDetail(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}

	@Post()
	async storeRecordFood(
		@Body() params: RequestCreateRecordFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.foodService.storeRecordFood(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	@Put()
	async updateRecordFood(
		@Body() params: RequestUpdateRecordFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.foodService.updateRecordFood(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_UPDATE, data);
	}

	@Get('nutrition')
	async getNutrition(
		@Query() params: RequestListNutritionDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.foodService.getNutrition(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}
}
