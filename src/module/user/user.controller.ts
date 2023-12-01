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
import { UserService } from './user.service';

/* DTO */
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// dev: all users (harus bikin authorization atau dijalanin pas lokal)
	// @Get('all')
	// async getUsers() {
	// 	const data = await this.userService.getUsers();
	// 	return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	// }

	// user (untuk retrieve data user tertentu dengan syarat headernya harus sesuai sama user biar user 1 gabisa ngambil user 2)
	@Get()
	async getUserById(@Headers('fona-client-uid') uid: string) {
		const data = await this.userService.getUserById(uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}

	// user
	@Post()
	async storeUsers(@Body() params: CreateUserDto, @Headers('fona-client-uid') uid: string) {
		const data = await this.userService.storeUser(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_CREATE, data);
	}

	@Put()
	async alterUserById(@Body() params: UpdateUserDto, @Headers('fona-client-uid') uid: string) {
		const data = await this.userService.updateUser(params, uid);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_UPDATE, data);
	}
}
