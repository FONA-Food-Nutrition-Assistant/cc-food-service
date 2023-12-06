import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PutModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async updateFood({ params, uid }) {
		try {
			const checker = await this.UserNutritionRepository.createQueryBuilder(
				'food',
			)
				.where('user_id = :uid', { uid: uid })
				.andWhere('date = :date', { date: params.date })
				.andWhere('meal_time = :meal_time', { meal_time: params.meal_time })
				.getRawOne();

			if (!checker) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			await this.UserNutritionRepository.createQueryBuilder()
				.delete()
				.from(UserNutritionEntity)
				.where('user_id = :id', { id: uid })
				.andWhere('date = :date', { date: params.date })
				.andWhere('meal_time = :meal_time', {
					meal_time: params.meal_time,
				})
				.execute();

			let user_nutrition: Object;

			let data: Object[] = [];

			const foodRepo = this.UserNutritionRepository; // Assign the repository to a variable

			params.foods.forEach(async function (food, i) {
				try {
					user_nutrition = {
						user_id: uid,
						nutrition_id: food.nutrition_id,
						quantity: food.quantity,
						date: params.date,
						meal_time: params.meal_time,
					};

					data.push(user_nutrition);

					try {
						await foodRepo
							.createQueryBuilder()
							.insert()
							.values(user_nutrition)
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

			return data;
		} catch (error) {
			throw error;
		}
	}
}
