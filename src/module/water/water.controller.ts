/* Nestjs Dependencies */
import {
	Body,
	Controller,
	Post,
	Put,
	HttpStatus,
	Headers,
	Delete,
} from '@nestjs/common';
// import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { WaterService } from './water.service';

/* DTO */
import { RequestCreateRecordWaterDto } from './dto/create-water.dto';
import { RequestUpdateRecordWaterDto } from './dto/update-water.dto';
import { RequestDeleteRecordWaterDto } from './dto/delete-water.dto';

@Controller('water')
export class WaterController {
	constructor(private readonly WaterService: WaterService) {}

	@Post()
	async storeWater(
		@Body() params: RequestCreateRecordWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.WaterService.createRecordWater(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, []);
	}

	@Put()
	async updateWater(
		@Body() params: RequestUpdateRecordWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.WaterService.updateRecordWater(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_UPDATE, data);
	}

	@Delete()
	async deleteWater(
		@Body() params: RequestDeleteRecordWaterDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.WaterService.deleteRecordWater(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_DELETE, data);
	}
}
