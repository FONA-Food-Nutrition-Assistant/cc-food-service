import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { RequestUpdateRecordFoodDto } from '../dto/update-record-food.dto';

@Injectable()
export class DeleteModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
	) {}

	async deleteUserNutritions(params: RequestUpdateRecordFoodDto) {
		let query = this.UserNutritionRepository.createQueryBuilder()
			.delete()
			.from(UserNutritionEntity)
			.where('user_id = :id', { id: params.uid })
			.andWhere('date = :date', { date: params.date })
			.andWhere('meal_time = :meal_time', {
				meal_time: params.meal_time,
			});

		return await query.execute();
	}
}
