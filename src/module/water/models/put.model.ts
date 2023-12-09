import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestUpdateRecordWaterDto } from '../dto/update-water.dto';

@Injectable()
export class PutModel {
	constructor(
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async updateRecordWater(params: RequestUpdateRecordWaterDto) {
		try {
			const water: Object = {
				user_id: params.uid,
				number_of_cups: params.number_of_cups,
				date: params.date,
			};

			const query = this.WaterRepository.createQueryBuilder()
				.update()
				.set(water)
				.where('user_id = :uid', { uid: params.uid })
				.andWhere('date = :date', { date: params.date })
				.returning('*');

			return await query.execute();
		} catch (error) {
			throw error;
		}
	}
}
