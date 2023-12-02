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
		private readonly RecordFoodRepository: Repository<RecordFoodEntity>,
	) {}

	async storeRecordFood({ params, uid }) {
		try {
			const checker = await this.RecordFoodRepository.createQueryBuilder('food')
				.where('user_id = :uid', { uid: uid })
				.where('date = :date', { date: params.date })
				.getRawOne();

			if (checker) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			let user_food: Object;

			const recordFoodRepo = this.RecordFoodRepository; // Assign the repository to a variable

			params.foods.forEach(async function(food, i) {

				user_food = {
					user_id: uid,
					food_id: food.food_id,
					quantity: food.quantity,
					date: params.date,
					created_at: new Date().toISOString().split('T')[0],
					updated_at: new Date().toISOString().split('T')[0],
				};

				try {
					await recordFoodRepo.createQueryBuilder()
                    .insert()
                    .values(user_food)
                    .execute();
				} catch (error) {
					console.error('Error while inserting:', error);
                	throw error; // Rethrow the error to handle it where the function is called
				}
			});

			return "User foods has been successfuly registered!";
			
		} catch (error) {
			throw error;
		}
	}
}
