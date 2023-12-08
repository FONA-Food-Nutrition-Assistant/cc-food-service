import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async storeFood({ params, uid }) {
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

			await nutritionRepo
				.createQueryBuilder()
				.insert()
				.values(user_nutrition)
				.execute();
		});

		return data;
	}
}
