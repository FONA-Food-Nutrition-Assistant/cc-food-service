import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';

@Injectable()
export class FoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
	) {}

	async getFood(params, uid) {
		try {
			const data = await this.GetModel.getFood({ params, uid });
			return data;
		} catch (error) {
			throw error;
		}
	}

	async storeFood(params, uid) {
		try {
			const data = await this.PostModel.storeFood({ params, uid });
			return data;
		} catch (error) {
			throw error;
		}
	}

	async updateFood(params, uid) {
		try {
			const data = await this.PutModel.updateFood({ params, uid });
			return data;
		} catch (error) {
			throw error;
		}
	}
}
