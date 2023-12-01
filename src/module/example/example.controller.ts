/* Nestjs Dependencies */
import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { ExampleService } from './example.service';

/* DTO */
// import { ExampleDTO } from './dto/example.dto'; // example DTO

@Controller('example')
export class ExampleController {
	constructor(private readonly exampleService: ExampleService) {}

	@Get()
	getHello(@Res() res: FastifyReply) {
		const data = {
			message: 'Hello World!',
		};
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	}

	// Error handling with empty message
	@Get('error')
	getError(@Res() res: FastifyReply) {
		throw new HttpException(null, HttpStatus.BAD_REQUEST);
	}

	// Error handling with custom message
	@Get('error-custom')
	getErrorCustom(@Res() res: FastifyReply) {
		throw new HttpException('Custom error message', HttpStatus.BAD_REQUEST);
	}

	// Error handling with custom message as object
	@Get('error-custom-object')
	getErrorCustomObject(@Res() res: FastifyReply) {
		const data = {
			foo: 'bar',
		};
		throw new HttpException(data, HttpStatus.BAD_REQUEST);
	}

	@Get('fona-members')
	async getFonaMembers(@Res() res: FastifyReply) {
		const data = await this.exampleService.getFonaMembersWithLearningPath();
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	}
}
