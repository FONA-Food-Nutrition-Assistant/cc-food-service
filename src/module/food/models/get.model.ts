import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodEntity } from '../entities/food.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { NutritionEntity } from '../entities/nutrition.entity';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
import { BaseRequestDto } from '../dto/base-request.dto';
import { RequestListFoodDto } from '../dto/list-food.dto';
import { RequestListNutritionDto } from '../dto/list-nutrition.dto';
import { FoodAllergyEntity } from '../entities/food-allergy.entity';
import { UserAllergyEntity } from '../entities/user-allergy.entity';
import { AllergyEntity } from '../entities/allergy.entity';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(FoodEntity)
		private readonly FoodRepository: Repository<FoodEntity>,
		@InjectRepository(NutritionEntity)
		private readonly NutritionRepository: Repository<NutritionEntity>,
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
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

	async checkRegisteredNutrition(params) {
		const query = this.UserNutritionRepository.createQueryBuilder()
			.where('user_id = :uid', { uid: params.uid })
			.andWhere('date = :date', { date: params.date })
			.andWhere('meal_time = :meal_time', { meal_time: params.meal_time });

		return await query.getRawOne();
	}

	async checkNutritionsAllergies(nutritionIds: Array<number>, uid: string) {
		const query = this.NutritionRepository.createQueryBuilder('n')
			.select('f.name as Food')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.leftJoin(FoodAllergyEntity, 'fa', 'fa.food_id = f.id')
			.leftJoin(AllergyEntity, 'a', 'a.id = fa.allergy_id')
			.leftJoin(UserAllergyEntity, 'ua', 'ua.allergy_id = a.id')
			.where('ua.user_id = :uid', { uid })
			.andWhere('n.id in (:...ids)', { ids: nutritionIds });

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
