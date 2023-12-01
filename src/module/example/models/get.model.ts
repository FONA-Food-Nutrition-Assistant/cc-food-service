import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from '../entities/member.entity';
import { Repository } from 'typeorm';
import { LearningPathEntity } from '../entities/learning-path.entity';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(MemberEntity)
		private readonly MemberRepository: Repository<MemberEntity>,
		@InjectRepository(LearningPathEntity)
		private readonly LearningPathRepository: Repository<LearningPathEntity>,
	) {}

	async getFonaMembersWithLearningPath() {
		try {
			const query = this.MemberRepository.createQueryBuilder('mem')
				.select('mem.id', 'id')
				.addSelect('mem.name', 'name')
				.addSelect('mem.email', 'email')
				.addSelect('lp.name', 'learningPath')
				.leftJoin(LearningPathEntity, 'lp', 'lp.id = mem.learning_path')
				.orderBy('mem.id, mem.name', 'ASC');

			return {
				data: await query.getRawMany(),
				total_data: await query.getCount(),
			};
		} catch (error) {
			throw error;
		}
	}
}
