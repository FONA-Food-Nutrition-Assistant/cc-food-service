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
import { runInTransaction } from 'src/db/run-in-transaction';

import { DataSource } from 'typeorm';

@Injectable()
export class WaterService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
		private readonly dataSource: DataSource,
	) {}

	async createRecordWater(params: RequestCreateRecordWaterDto) {
		try {
			return await runInTransaction(this.dataSource, async em => {
				const checkRegisteredWater = await this.GetModel.checkRegisteredWater(
					params,
				);

				if (checkRegisteredWater) {
					throw new HttpException(
						ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
						HttpStatus.BAD_REQUEST,
					);
				}

				const data = await this.PostModel.createRecordWater(params, em);
				return data;
			});
		} catch (error) {
			throw error;
		}
	}

	async updateRecordWater(params: RequestUpdateRecordWaterDto) {
		try {
			return await runInTransaction(this.dataSource, async em => {
				const checkRegisteredWater = await this.GetModel.checkRegisteredWater(
					params,
				);

				if (!checkRegisteredWater) {
					throw new HttpException(
						ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
						HttpStatus.BAD_REQUEST,
					);
				}

				const data = await this.PutModel.updateRecordWater(
					params,
					checkRegisteredWater,
					em,
				);
				return data;
			});
		} catch (error) {
			throw error;
		}
	}
}
