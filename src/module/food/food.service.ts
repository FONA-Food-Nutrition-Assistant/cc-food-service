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
import {
	RequestUpdateRecordFoodDto,
	ResponseUpdateRecordFoodDto,
} from './dto/update-record-food.dto';
import {
	RequestCreateRecordFoodDto,
	ResponseCreateRecordFoodDto,
} from './dto/create-record-food.dto';
import { runInTransaction } from '../../db/run-in-transaction';
import { DataSource } from 'typeorm';
import { RequestDeleteRecordFoodDto } from './dto/delete-record-food.dto';

@Injectable()
export class FoodService {
	constructor(
		private readonly PutModel: PutModel,
		private readonly PostModel: PostModel,
		private readonly GetModel: GetModel,
		private readonly DeleteModel: DeleteModel,
		private readonly dataSource: DataSource,
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

			const foodsContainAllergies =
				await this.GetModel.getFoodsContainAllergies(params.uid);

			const foodsContainAllergiesId = foodsContainAllergies.map(
				food => food.id,
			);

			const nutrition = await this.GetModel.getNutritionByFoodIds(
				food.map(food => food.id),
			);

			const data = food.map(food => {
				const isUserAllergy = foodsContainAllergiesId.includes(food.id);
				const tempNutrition = nutrition.filter(
					nutrition => nutrition.food_id === food.id,
				);
				return {
					...food,
					is_user_allergy: isUserAllergy,
					nutritions: tempNutrition,
				} as ResponseFoodDetailDto;
			});

			return data;
		} catch (error) {
			throw error;
		}
	}

	async storeRecordFood(params: RequestCreateRecordFoodDto) {
		try {
			return await runInTransaction(this.dataSource, async em => {
				const checkRegisteredNutritions =
					await this.GetModel.checkRegisteredNutrition(params);

				if (checkRegisteredNutritions) {
					throw new HttpException(
						ResponseMessage.ERR_FOOD_DATA_HAS_BEEN_REGISTERED,
						HttpStatus.BAD_REQUEST,
					);
				}

				await this.DeleteModel.deleteUserNutritions(params, em);

				const data = await this.PostModel.storeFood(params, em);

				const foods = params.foods.map(food => food.nutrition_id);

				let foodsContainAllergies =
					await this.GetModel.checkNutritionsAllergies(foods, params.uid);

				foodsContainAllergies = foodsContainAllergies.map(val => val.food);

				const isFoodsContainAllergies =
					foodsContainAllergies.length > 0 || false;

				return {
					is_foods_contain_allergies: isFoodsContainAllergies,
					foods_contain_allergies: foodsContainAllergies,
					data,
				} as ResponseCreateRecordFoodDto;
			});
		} catch (error) {
			throw error;
		}
	}

	async updateRecordFood(params: RequestUpdateRecordFoodDto) {
		try {
			const checkRegisteredNutritions =
				await this.GetModel.checkRegisteredNutrition(params);

			if (!checkRegisteredNutritions) {
				throw new HttpException(
					ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED,
					HttpStatus.BAD_REQUEST,
				);
			}

			await this.DeleteModel.deleteUserNutritions(params);

			const data = await this.PutModel.updateFood(params);

			const foods = params.foods.map(food => food.nutrition_id);

			let foodsContainAllergies = await this.GetModel.checkNutritionsAllergies(
				foods,
				params.uid,
			);

			foodsContainAllergies = foodsContainAllergies.map(val => val.food);

			const isFoodsContainAllergies = foodsContainAllergies.length > 0 || false;

			return {
				is_foods_contain_allergies: isFoodsContainAllergies,
				foods_contain_allergies: foodsContainAllergies,
				data,
			} as ResponseUpdateRecordFoodDto;
		} catch (error) {
			throw error;
		}
	}

	async deleteRecordFood(params: RequestDeleteRecordFoodDto) {
		try {
			for (const nutrition_id of params.nutrition_ids) {
				const checkRegisteredNutritions =
					await this.GetModel.checkRegisteredNutritionForDelete(
						params,
						nutrition_id,
					);

				if (!checkRegisteredNutritions) {
					throw new HttpException(
						ResponseMessage.ERR_FOOD_DATA_HAS_NOT_BEEN_REGISTERED_FOR_DELETE,
						HttpStatus.BAD_REQUEST,
					);
				}
			}

			params.nutrition_ids.forEach(async nutrition_id => {
				await this.DeleteModel.deleteUserNutritionByIds(params, nutrition_id);
			});

			return 'User Record Foods has been deleted';
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
