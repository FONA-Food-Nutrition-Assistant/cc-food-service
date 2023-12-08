import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterEntity } from '../entities/water.entity';
import { RequestCreateRecordWaterDto } from '../dto/create-water.dto';
import { RequestUpdateRecordWaterDto } from '../dto/update-water.dto';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
	) {}

	async checkRegisteredWater(
		params: RequestCreateRecordWaterDto | RequestUpdateRecordWaterDto,
	) {
		let query = this.WaterRepository.createQueryBuilder('water')
			.where('user_id = :uid', { uid: params.uid })
			.andWhere('date = :date', { date: params.date });

		return await query.getRawOne();
	}
}
