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
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ListFoodDto } from './dto/list-food.dto';

@Controller('food')
export class FoodController {
	constructor(private readonly foodService: FoodService) {}

	@Get()
	async getFood(
		@Query() params: ListFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.foodService.getFood(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}

	@Post()
	async storeFood(
		@Body() params: CreateFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.foodService.storeFood(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	@Put()
	async updateWater(
		@Body() params: UpdateFoodDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.foodService.updateFood(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_UPDATE, data);
	}
}
