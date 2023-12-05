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
import { HomeService } from './home.service';

/* DTO */
import { CreateHomeDto } from './dto/create-home.dto';

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get()
	async home(
		@Body() params: CreateHomeDto,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.homeService.getAllData(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}
}
