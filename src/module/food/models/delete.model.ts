import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { RequestUpdateRecordFoodDto } from '../dto/update-record-food.dto';

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
	) {
		return await em.delete(UserNutritionEntity, {
			user_id: params.uid,
			date: params.date,
			meal_time: params.meal_time,
		});
	}
}
