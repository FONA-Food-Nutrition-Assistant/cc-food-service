import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Injectable()
export class RecordWaterService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel, // private readonly PutModel: PutModel,
	) {}

	async storeWaterById(params, uid) {
		try {
			const user = await this.PostModel.storeWaterById({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}

	async updateWaterById(params, uid) {
		try {
			const user = await this.PutModel.updateWaterById({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}
}
