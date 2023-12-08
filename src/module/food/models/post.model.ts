import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { RequestCreateRecordFoodDto } from '../dto/create-record-food.dto';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async storeFood(params: RequestCreateRecordFoodDto) {
		let userNutrition: UserNutritionEntity;
		let data: Object[] = [];
		const nutritionRepo = this.UserNutritionRepository;

		params.foods.forEach(async function (food) {
			userNutrition = {
				user_id: params.uid,
				nutrition_id: food.nutrition_id,
				quantity: food.quantity,
				date: new Date(params.date),
				meal_time: params.meal_time,
			};

			data.push(userNutrition);

			await nutritionRepo
				.createQueryBuilder()
				.insert()
				.values(userNutrition)
				.execute();
		});

		return data as Object[];
	}
}
