import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestCreateRecordWaterDto } from '../dto/create-water.dto';

@Injectable()
export class PostModel {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async createRecordWater(
		params: RequestCreateRecordWaterDto,
		em: EntityManager = this.dataSource.manager,
	): Promise<WaterEntity> {
		const newRecordWater: Object = {
			user_id: params.uid,
			number_of_cups: params.number_of_cups,
			date: params.date,
		};

		return await em.save(WaterEntity, newRecordWater);
	}
}
