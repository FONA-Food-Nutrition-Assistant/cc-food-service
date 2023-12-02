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
import { RecordWaterService } from './record_water.service';

/* DTO */
import { CreateRecordWaterDto } from './dto/create-record_water.dto';
import { UpdateRecordWaterDto } from './dto/update-record_water.dto';

@Controller('water')
export class WaterController {
	constructor(private readonly waterService: RecordWaterService) {}

	@Post()
	async storeWater(
		@Body() params: CreateRecordWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.waterService.storeWaterById(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	@Put()
	async updateWater(
		@Body() params: CreateRecordWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.waterService.updateWaterById(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}
}
