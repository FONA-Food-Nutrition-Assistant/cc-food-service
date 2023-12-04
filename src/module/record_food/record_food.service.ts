import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Injectable()
export class RecordFoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel, // private readonly PutModel: PutModel,
	) {}

	async storeRecordFood(params, uid) {
		try {
			const user = await this.PostModel.storeRecordFood({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}

	async updateRecordFood(params, uid) {
		try {
			const user = await this.PutModel.updateRecordFood({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}
}
