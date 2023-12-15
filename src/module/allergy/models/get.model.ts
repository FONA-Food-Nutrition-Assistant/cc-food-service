import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRequestDto } from 'src/module/food/dto/base-request.dto';
import { AllergyEntity } from 'src/module/food/entities/allergy.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { RequestListAllergyDto } from '../dto/list-allergy.dto';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(AllergyEntity)
		private readonly AllergyRepository: Repository<AllergyEntity>,
	) {}

	async getAllergy(params: RequestListAllergyDto) {
		try {
			let query = this.AllergyRepository.createQueryBuilder('al')
				.select('id')
				.addSelect('name');

			if (params.id.length > 0) {
				query = query.where('id IN (:...id)', { id: params.id });
			}

			if (params.search.length > 0) {
				query = query.andWhere(
					new Brackets(qb => {
						params.search.forEach((keyword: string, index: number) => {
							qb.orWhere(`LOWER(al.name) LIKE :keword_${index}`, {
								[`keword_${index}`]: `%${keyword.toLowerCase()}%`,
							});
						});
					}),
				);
			}

			query = this._defaultParams(query, params);

			return await query.getRawMany();
		} catch (error) {
			throw error;
		}
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
