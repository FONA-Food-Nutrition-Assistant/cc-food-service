import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { RequestCreateRecordFoodDto } from '../dto/create-record-food.dto';
import { FoodEntity } from '../entities/food.entity';

@Injectable()
export class PostModel {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async storeFood(
		params: RequestCreateRecordFoodDto,
		em: EntityManager = this.dataSource.manager,
	): Promise<any> {
		let userNutrition: UserNutritionEntity;
		let data: Object[] = [];

		params.foods.forEach(async function (food) {
			userNutrition = {
				user_id: params.uid,
				nutrition_id: food.nutrition_id,
				quantity: food.quantity,
				date: new Date(params.date),
				meal_time: params.meal_time,
			};

			data.push(userNutrition);

			return await em.save(UserNutritionEntity, userNutrition);
		});

		return data as Object[];
	}
}
