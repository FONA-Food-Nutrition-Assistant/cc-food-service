import { Injectable } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';
import { DeleteModel } from './models/delete.model';
import {
	RequestFoodDetailDto,
	ResponseFoodDetailDto,
} from './dto/food-detail.dto';
import { RequestListFoodDto, ResponseListFoodDto } from './dto/list-food.dto';
import {
	RequestListNutritionDto,
	ResponseListNutritionDto,
} from './dto/list-nutrition.dto';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Console } from 'console';
import { RequestUpdateRecordFoodDto } from './dto/update-record-food.dto';

@Injectable()
export class FoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
		private readonly DeleteModel: DeleteModel,
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
			let foods_contain_allergies: boolean = false;

			const check_registered_nutritions =
				await this.GetModel.checkRegisteredNutrition({ params, uid });

			if (check_registered_nutritions) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			const foods = params.foods.map(food => food.nutrition_id);

			const check_nutritions_allergies =
				await this.GetModel.checkNutritionsAllergies(foods, params.uid);

			if (check_nutritions_allergies) {
				foods_contain_allergies = true;
			}

			const data = await this.PostModel.storeFood({ params, uid });

			return {
				foods_contain_allergies,
			};
		} catch (error) {
			throw error;
		}
	}

	async updateFood(params: RequestUpdateRecordFoodDto) {
		try {
			const check_registered_nutritions =
				await this.GetModel.checkRegisteredNutrition(params);

			if (!check_registered_nutritions) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			await this.DeleteModel.deleteUserNutritions(params);

			const data = await this.PutModel.updateFood(params);

			const foods = params.foods.map(food => food.nutrition_id);

			let foods_contain_allergies =
				await this.GetModel.checkNutritionsAllergies(foods, params.uid);

			foods_contain_allergies = foods_contain_allergies.map(val => val.food);

			const is_foods_contain_allergies =
				foods_contain_allergies.length > 0 || false;

			return {
				is_foods_contain_allergies,
				foods_contain_allergies,
				data,
			};
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
