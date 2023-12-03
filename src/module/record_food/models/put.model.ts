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
		private readonly RecordFoodRepository: Repository<RecordFoodEntity>,
	) {}

	async updateRecordFood({ params, uid }) {
		try {
			await this.RecordFoodRepository.createQueryBuilder()
				.delete()
				.from(RecordFoodEntity)
				.where('user_id = :id', { id: uid })
				.where('date = :date', { date: params.date })
				.execute();

			let user_food: Object;

			const recordFoodRepo = this.RecordFoodRepository; // Assign the repository to a variable

			params.foods.forEach(async function (food, i) {
				user_food = {
					user_id: uid,
					food_id: food.food_id,
					quantity: food.quantity,
					date: params.date,
					created_at: new Date().toISOString().split('T')[0], // ini karena sistemnya delete dan update, jadi di reset
					updated_at: new Date().toISOString().split('T')[0],
				};

				try {
					user_food = {
						user_id: uid,
						food_id: food.food_id,
						quantity: food.quantity,
						date: params.date,
					};

					try {
						await recordFoodRepo
							.createQueryBuilder()
							.insert()
							.values(user_food)
							.execute();
					} catch (error) {
						console.error('Error while inserting:', error);
						throw error; // Rethrow the error to handle it where the function is called
					}
				} catch (error) {
					console.error('Error while inserting:', error);
					throw error; // Rethrow the error to handle it where the function is called
				}
			});

			return 'User daily foods information has been successfuly updated!';
		} catch (error) {
			throw error;
		}
	}
}
