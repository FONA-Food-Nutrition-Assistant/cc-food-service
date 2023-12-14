import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	DataSource,
	EntityManager,
	Repository,
	UpdateDescription,
	UpdateResult,
} from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestUpdateRecordWaterDto } from '../dto/update-water.dto';

@Injectable()
export class PutModel {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async updateRecordWater(
		params: RequestUpdateRecordWaterDto,
		checkRegisteredWater: WaterEntity,
		em: EntityManager = this.dataSource.manager,
	): Promise<UpdateResult> {
		const { number_of_cups } = params;

		const recordWater = {
			...checkRegisteredWater,
			number_of_cups,
		};

		return await em.update(
			WaterEntity,
			{ id: checkRegisteredWater.id },
			recordWater,
		);
	}
}
