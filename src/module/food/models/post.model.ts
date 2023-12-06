import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async storeFood({ params, uid }) {
		try {
			const checker = await this.UserNutritionRepository.createQueryBuilder()
				.where('user_id = :uid', { uid: uid })
				.andWhere('date = :date', { date: params.date })
				.andWhere('meal_time = :meal_time', { meal_time: params.meal_time })
				.getRawOne();

			if (checker) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			let user_nutrition: Object;

			let data: Object[] = [];

			const nutritionRepo = this.UserNutritionRepository;

			params.foods.forEach(async function (food) {
				user_nutrition = {
					user_id: uid,
					nutrition_id: food.nutrition_id,
					quantity: food.quantity,
					date: params.date,
					meal_time: params.meal_time,
				};

				data.push(user_nutrition);

				console.log(data);

				try {
					await nutritionRepo
						.createQueryBuilder()
						.insert()
						.values(user_nutrition)
						.execute();
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
