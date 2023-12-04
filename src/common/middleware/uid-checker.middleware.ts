import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class UidCheckerMiddleware implements NestMiddleware {
	constructor(private readonly configService: ConfigService) {}

	use(req: FastifyRequest, res: FastifyReply, next: () => void) {
		const { headers } = req;

		if (!headers['fona-client-uid']) {
			throw new HttpException('Header does not have an UID', HttpStatus.BAD_REQUEST);
		}
		
		next();
	}
}
