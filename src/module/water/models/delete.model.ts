import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestDeleteRecordWaterDto } from '../dto/delete-water.dto';

@Injectable()
export class DeleteModel {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async deleteRecordWater(
		params: RequestDeleteRecordWaterDto,
		em: EntityManager = this.dataSource.manager,
	): Promise<DeleteResult> {
		return await em.delete(WaterEntity, {
			user_id: params.uid,
			date: params.date,
		});
	}
}
