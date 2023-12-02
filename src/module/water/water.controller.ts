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
import { WaterService } from './water.service';

/* DTO */
import { CreateWaterDto } from './dto/create-water.dto';
import { UpdateWaterDto } from './dto/update-water.dto';

@Controller('water')
export class WaterController {
	constructor(private readonly waterService: WaterService) {}

	@Post()
	async storeWater(
		@Body() params: CreateWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.waterService.storeWaterById(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	@Put()
	async updateWater(
		@Body() params: CreateWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.waterService.updateWaterById(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}
}
