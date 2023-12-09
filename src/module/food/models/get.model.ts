import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { BaseRequestDto } from '../dto/base-request.dto';
import { RequestListFoodDto } from '../dto/list-food.dto';
import { RequestListNutritionDto } from '../dto/list-nutrition.dto';

import { FoodEntity } from '../entities/food.entity';
import { NutritionEntity } from '../entities/nutrition.entity';
import { UserNutritionEntity } from '../entities/user-nutrition.entity';
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
		@InjectRepository(UserAllergyEntity)
		private readonly UserAllergyRepository: Repository<UserAllergyEntity>,
		@InjectRepository(FoodAllergyEntity)
		private readonly FoodAllergyRepository: Repository<FoodAllergyEntity>,
	) {}

	async getFood(params: RequestListFoodDto): Promise<FoodEntity[]> {
		let query = this.FoodRepository.createQueryBuilder('food')
			.select('id')
			.addSelect('name');

		if (params.id.length > 0) {
			query = query.where('food.id IN (:...ids)', { ids: params.id });
		}

		if (params.search.length > 0) {
			query = query.andWhere(
				new Brackets(qb => {
					params.search.forEach((keyword, index) => {
						qb.orWhere(`LOWER(food.name) LIKE :keword_${index}`, {
							[`keword_${index}`]: `%${keyword.toLowerCase()}%`,
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
		if (params.id.length > 0) {
			query = query.where('nu.id IN (:...ids)', { ids: params.id });
		}
		if (params.food_id.length > 0) {
			query = query.where('nu.food_id IN (:...foodIds)', {
				foodIds: params.food_id,
			});
		}
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

	async checkRegisteredNutrition({ params, uid }) {
		const query = this.UserNutritionRepository.createQueryBuilder()
			.where('user_id = :uid', { uid: uid })
			.andWhere('date = :date', { date: params.date })
			.andWhere('meal_time = :meal_time', { meal_time: params.meal_time });

		return await query.getRawOne();
	}

	async checkNutritionsAllergies({ params, uid }) {
		const query = this.UserNutritionRepository.createQueryBuilder('un')
			.select('f.name as Food')
			.leftJoin(NutritionEntity, 'n', 'n.id = un.nutrition_id')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.leftJoin(FoodAllergyEntity, 'fa', 'fa.food_id = f.id')
			.leftJoin(AllergyEntity, 'a', 'a.id = fa.allergy_id')
			.where('un.user_id = :uid', { uid })
			.andWhere('un.date = :date', { date: params.date })
			.andWhere('un.meal_time = :meal_time', { meal_time: params.meal_time });

		return await query.getRawMany();
	}

	async getFoodsContainAllergies(uid: string): Promise<any[]> {
		const query = this.UserAllergyRepository.createQueryBuilder('ua')
			.select('f.id', 'id')
			.addSelect('f.name', 'name')
			.leftJoin(FoodAllergyEntity, 'fa', 'fa.allergy_id = ua.allergy_id')
			.leftJoin(FoodEntity, 'f', 'f.id = fa.food_id')
			.where('ua.user_id = :uid', { uid });

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
