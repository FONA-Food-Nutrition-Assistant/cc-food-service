import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordWaterEntity } from '../entities/record_water.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(RecordWaterEntity)
		private readonly WaterRepository: Repository<RecordWaterEntity>,
	) {}

	async storeWaterById({ params, uid }) {
		try {
			const checker = await this.WaterRepository.createQueryBuilder('water')
				.where('user_id = :uid', { uid: uid })
				.andWhere('date = :date', { date: params.date })
				.getRawOne();

			if (checker) {
				throw new HttpException(
					ResponseMessage.ERR_WATER_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const water = {
				user_id: uid,
				number_of_cups: params.number_of_cups,
				date: params.date,
			};

			const result = await this.WaterRepository.createQueryBuilder()
				.insert()
				.values(water)
				.returning('id')
				.execute()
				.catch(error => {
					console.error('Error while inserting:', error);
					throw error; // Rethrow the error to handle it where the function is called
				});

			return result;
		} catch (error) {
			throw error;
		}
	}
}
