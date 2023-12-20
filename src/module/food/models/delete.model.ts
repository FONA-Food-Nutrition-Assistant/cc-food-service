import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { RequestUpdateRecordFoodDto } from '../dto/update-record-food.dto';
import { RequestDeleteRecordFoodDto } from '../dto/delete-record-food.dto';

@Injectable()
export class DeleteModel {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async deleteUserNutritions(
		params: RequestUpdateRecordFoodDto,
		em: EntityManager = this.dataSource.manager,
	): Promise<DeleteResult> {
		return await em.delete(UserNutritionEntity, {
			user_id: params.uid,
			date: params.date,
			meal_time: params.meal_time,
		});
	}

	async deleteUserNutritionByIds(
		params: RequestDeleteRecordFoodDto,
		nutrition_id: number,
		em: EntityManager = this.dataSource.manager,
	): Promise<DeleteResult> {
		return await em.delete(UserNutritionEntity, {
			user_id: params.uid,
			nutrition_id: nutrition_id,
			date: params.date,
			meal_time: params.meal_time,
		});
	}
}
