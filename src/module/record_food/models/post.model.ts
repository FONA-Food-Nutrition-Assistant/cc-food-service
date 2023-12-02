import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordFoodEntity } from '../entities/record_food.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(RecordFoodEntity)
		private readonly FoodRepository: Repository<RecordFoodEntity>,
	) {}

	async storeRecordFood({ params, uid }) {
		try {
			const checker = await this.FoodRepository.createQueryBuilder('food')
				.where('user_id = :uid', { uid: uid })
				.where('date = :date', { date: params.date })
				.getRawOne();

			if (checker) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const food = {
				user_id: uid,
				number_of_cups: params.number_of_cups,
				date: params.date,
				created_at: new Date().toISOString().split('T')[0],
				updated_at: new Date().toISOString().split('T')[0],
			};

			const result = await this.FoodRepository.createQueryBuilder()
				.insert()
				.values(food)
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
