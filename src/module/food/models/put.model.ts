import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFoodEntity } from '../entities/user-food.entity';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PutModel {
	constructor(
		@InjectRepository(UserFoodEntity)
		private readonly FoodRepository: Repository<UserFoodEntity>,
	) {}

	async updateFood({ params, uid }) {
		try {
			const checker = await this.FoodRepository.createQueryBuilder('food')
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

			await this.FoodRepository.createQueryBuilder()
				.delete()
				.from(UserFoodEntity)
				.where('user_id = :id', { id: uid })
				.andWhere('date = :date', { date: params.date })
				.andWhere('meal_time = :meal_time', { meal_time: params.meal_time })
				.execute();

			let user_food: Object;

			const foodRepo = this.FoodRepository; // Assign the repository to a variable

			params.foods.forEach(async function (food, i) {
				try {
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
				} catch (error) {
					console.error('Error while inserting:', error);
					throw error; // Rethrow the error to handle it where the function is called
				}
			});

			return user_food;
		} catch (error) {
			throw error;
		}
	}
}
