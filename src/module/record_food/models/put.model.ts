import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordFoodEntity } from '../entities/record_food.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PutModel {
	constructor(
		@InjectRepository(RecordFoodEntity)
		private readonly WaterRepository: Repository<RecordFoodEntity>,
	) {}

	async updateWaterById({ params, uid }) {
		try {
			const checker = await this.WaterRepository.createQueryBuilder('water')
				.where('user_id = :uid', { uid: uid })
				.where('date = :date', { date: params.date })
				.getRawOne();

			if (!checker) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const updatedData = {
				...params,
				updated_at: new Date().toISOString().split('T')[0],
			};

			const result = await this.WaterRepository.createQueryBuilder()
				.update()
				.set(updatedData)
				.where('uid = :uid', { uid: uid })
				.where('date = :date', { date: params.date })
				.execute()
				.catch(error => {
					console.error('Error while updating:', error);
					throw error; // Rethrow the error to handle it where the function is called
				});

			return result;
		} catch (error) {
			throw error;
		}
	}
}
