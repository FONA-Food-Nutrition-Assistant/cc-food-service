import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodEntity } from '../entities/food.entity';
import { BaseEntity, Repository, SelectQueryBuilder } from 'typeorm';
import { NutritionEntity } from '../entities/nutrition.enitity';
import { BaseRequestDto } from '../dto/base-request.dto';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(FoodEntity)
		private readonly FoodRepository: Repository<FoodEntity>,
		@InjectRepository(NutritionEntity)
		private readonly NutritionRepository: Repository<NutritionEntity>,
	) {}

	async getFood({ params, uid }) {
		let query = this.FoodRepository.createQueryBuilder('food').select('*');
		query = this._defaultParams(query, params);
		return await query.getRawMany();
	}

	_defaultParams(query: SelectQueryBuilder<any>, params: any & BaseRequestDto) {
		query
			.limit(params.limit)
			.offset(params.offset)
			.orderBy(params.sort, params.order);
		return query;
	}
}
