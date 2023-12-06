import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodEntity } from '../entities/food.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { NutritionEntity } from '../entities/nutrition.entity';
import { BaseRequestDto } from '../dto/base-request.dto';
import { RequestListFoodDto } from '../dto/list-food.dto';
import { RequestListNutritionDto } from '../dto/list-nutrition.dto';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(FoodEntity)
		private readonly FoodRepository: Repository<FoodEntity>,
		@InjectRepository(NutritionEntity)
		private readonly NutritionRepository: Repository<NutritionEntity>,
	) {}

	async getFood(params: RequestListFoodDto): Promise<FoodEntity[]> {
		let query = this.FoodRepository.createQueryBuilder('food').select('*');

		if (params.id.length > 0) {
			query = query.where('food.id IN (:...ids)', { ids: params.id });
		}

		if (params.search.length > 0) {
			query = query.andWhere(
				new Brackets(qb => {
					params.search.forEach(keyword => {
						qb.andWhere('LOWER(food.name) LIKE :keyword', {
							keyword: `%${keyword.toLowerCase()}%`,
						});
					});
				}),
			);
		}

		query = this._defaultParams(query, params);

		return await query.getRawMany();
	}

	async getNutrition(
		params: RequestListNutritionDto,
	): Promise<NutritionEntity[]> {
		let query = this.NutritionRepository.createQueryBuilder('nu').select('*');
		query = this._defaultParams(query, params);
		return await query.getRawMany();
	}

	async getNutritionByFoodIds(
		foodIds: Array<number>,
	): Promise<NutritionEntity[]> {
		let query = this.NutritionRepository.createQueryBuilder('nu')
			.select('*')
			.where('nu.food_id IN (:...foodIds)', { foodIds: foodIds });
		return await query.getRawMany();
	}

	private _defaultParams(
		query: SelectQueryBuilder<any>,
		params: any & BaseRequestDto,
	) {
		query
			.limit(params.limit)
			.offset(params.offset)
			.orderBy(params.sort, params.order);
		return query;
	}
}
