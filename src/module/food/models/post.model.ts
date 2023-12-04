import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodEntity } from '../entities/food.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(FoodEntity)
		private readonly FoodRepository: Repository<FoodEntity>,
	) {}

	async storeFood({ params, uid }) {
		try {
			const checker = await this.FoodRepository.createQueryBuilder('food')
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

			let user_food: Object;

			const foodRepo = this.FoodRepository;

			params.foods.forEach(async function (food, i) {
				user_food = {
					user_id: uid,
					food_id: food.food_id,
					quantity: food.quantity,
					date: params.date,
					meal_time: params.meal_time,
				};

				try {
					await foodRepo
						.createQueryBuilder()
						.insert()
						.values(user_food)
						.execute();
				} catch (error) {
					console.error('Error while inserting:', error);
					throw error; // Rethrow the error to handle it where the function is called
				}
			});

			return 'User daily foods information has been successfuly registered!';
		} catch (error) {
			throw error;
		}
	}
}
