import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Injectable()
export class FoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel, // private readonly PutModel: PutModel,
	) {}

	async storeFood(params, uid) {
		try {
			const user = await this.PostModel.storeFood({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}

	async updateFood(params, uid) {
		try {
			const user = await this.PutModel.updateFood({ params, uid });
			return user;
		} catch (error) {
			throw error;
		}
	}
}
