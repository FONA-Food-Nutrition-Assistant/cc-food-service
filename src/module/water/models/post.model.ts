import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestCreateRecordWaterDto } from '../dto/create-water.dto';

@Injectable()
export class PostModel {
	constructor(
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async createRecordWater(params: RequestCreateRecordWaterDto) {
		try {
			const water: Object = {
				user_id: params.uid,
				number_of_cups: params.number_of_cups,
				date: params.date,
			};

			const query = this.WaterRepository.createQueryBuilder()
				.insert()
				.values(water)
				.returning('id');

			return await query.execute();
		} catch (error) {
			throw error;
		}
	}
}
