import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';
import {
	RequestUpdateRecordWaterDto,
	ResponseUpdateRecordWaterDto,
} from './dto/update-water.dto';
import {
	RequestCreateRecordWaterDto,
	ResponseCreateRecordWaterDto,
} from './dto/create-water.dto';
import { ResponseMessage } from 'src/common/message/message.enum';

@Injectable()
export class WaterService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
	) {}

	async createRecordWater(params: RequestCreateRecordWaterDto) {
		try {
			const checkRegisteredWater = await this.GetModel.checkRegisteredWater(
				params,
			);

			if (checkRegisteredWater) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const data = await this.PostModel.createRecordWater(params);
			return data as ResponseUpdateRecordWaterDto;
		} catch (error) {
			throw error;
		}
	}

	async updateRecordWater(params: RequestUpdateRecordWaterDto) {
		try {
			const checkRegisteredWater = await this.GetModel.checkRegisteredWater(
				params,
			);

			if (!checkRegisteredWater) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const data = await this.PutModel.updateRecordWater(params);
			return data as ResponseUpdateRecordWaterDto;
		} catch (error) {
			throw error;
		}
	}
}
