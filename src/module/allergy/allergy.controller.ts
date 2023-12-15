import { Headers, HttpStatus, Query } from '@nestjs/common';

import { Controller, Get } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { RequestListAllergyDto } from './dto/list-allergy.dto';
import { TidyResponse } from '../../util/responseHelper';
import { ResponseMessage } from '../../common/message/message.enum';

@Controller('allergy')
export class AllergyController {
	constructor(private readonly allergyService: AllergyService) {}

	@Get()
	async getAllergy(
		@Query() params: RequestListAllergyDto,
		@Headers('fona-client-uid') uid: string,
	) {
		params.prepParams(uid);
		const data = await this.allergyService.getAllergy(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK_LIST, data);
	}
}
