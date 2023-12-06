import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';
import {
	RequestFoodDetailDto,
	ResponseFoodDetailDto,
} from './dto/food-detail.dto';
import { RequestListFoodDto, ResponseListFoodDto } from './dto/list-food.dto';
import {
	RequestListNutritionDto,
	ResponseListNutritionDto,
} from './dto/list-nutrition.dto';

@Injectable()
export class FoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
	) {}

	async getFood(params: RequestListFoodDto) {
		try {
			const data = await this.GetModel.getFood(params);
			return data as ResponseListFoodDto[];
		} catch (error) {
			throw error;
		}
	}

	async getFoodDetail(params: RequestFoodDetailDto) {
		try {
			const food = await this.GetModel.getFood(params);
			if (food.length === 0) {
				return [] as ResponseFoodDetailDto[];
			}

			const nutrition = await this.GetModel.getNutritionByFoodIds(
				food.map(food => food.id),
			);

			const data = food.map(food => {
				const tempNutrition = nutrition.filter(
					nutrition => nutrition.food_id === food.id,
				);
				return {
					...food,
					nutritions: tempNutrition,
				} as ResponseFoodDetailDto;
			});

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

	async getNutrition(params: RequestListNutritionDto, uid) {
		try {
			const data = await this.GetModel.getNutrition(params);
			return data as ResponseListNutritionDto[];
		} catch (error) {
			throw error;
		}
	}
}
