import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordWaterEntity } from '../entities/record_food.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(RecordWaterEntity)
		private readonly WaterRepository: Repository<RecordWaterEntity>,
	) {}

	async getWaterById(uid) {
		try {
			const result = await this.WaterRepository.createQueryBuilder('user')
				.where('uid = :uid', { uid: uid })
				.getRawOne()
				.catch(error => {
					console.error('Error while retrieving:', error);
					throw error; // Rethrow the error to handle it where the function is called
				});

			if (!result)
				throw new HttpException(
					ResponseMessage.ERR_USER_NOT_FOUND,
					HttpStatus.BAD_REQUEST,
				);

			return result;
		} catch (error) {
			throw error;
		}
	}
}
