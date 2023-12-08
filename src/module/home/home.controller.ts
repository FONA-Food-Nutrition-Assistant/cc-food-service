/* Nestjs Dependencies */
import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	HttpStatus,
	Headers,
	Param,
	Query,
} from '@nestjs/common';
// import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { HomeService } from './home.service';

/* DTO */

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get()
	async home(
		@Query('date') date: string,
		@Headers('fona-client-uid') uid: string,
	) {
		const data = await this.homeService.getAllData(date, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}
}
