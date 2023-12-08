import { Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';
import { Mealtime } from '../../common/enum/meal_time.enum';
import { CalculationHelper } from '../../util/calculationHelper';
@Injectable()
export class HomeService {
	private readonly calculationHelper = new CalculationHelper();

	constructor(private readonly GetModel: GetModel) {}

	async foodAndQuantity(recordedNutrition, meal_time) {
		return recordedNutrition
			.filter(food => {
				return food.meal_time == meal_time;
			})
			.map(food => {
				return {
					name: food.name,
					quantity: food.quantity,
				};
			});
	}

	async getTdee(user) {
		const age = this.calculationHelper.calculateAge(user.date_of_birth);

		let tdee = parseFloat(
			this.calculationHelper
				.calculateTDEE(
					user.weight,
					user.height,
					age,
					user.gender,
					user.activity,
				)
				.toFixed(2),
		);

		return tdee;
	}

	async calorieIntake(tdee) {
		const lowestbreakfastIntake = Math.round((30 / 100) * tdee);
		const highestbreakfastIntake = Math.round((35 / 100) * tdee);

		const lowestlunchIntake = Math.round((35 / 100) * tdee);
		const highestlunchIntake = Math.round((40 / 100) * tdee);

		const lowestdinnerIntake = Math.round((25 / 100) * tdee);
		const highestdinnerIntake = Math.round((35 / 100) * tdee);

		return {
			lowestbreakfastIntake,
			highestbreakfastIntake,
			lowestlunchIntake,
			highestlunchIntake,
			lowestdinnerIntake,
			highestdinnerIntake,
		};
	}

	async foodRecommendation(tdee) {}

	async getAllData(date, uid) {
		try {
			const user = await this.GetModel.getUserById(uid);
			let tdee = await this.getTdee(user);
			// let calorieIntake = await this.calorieIntake(tdee);

			// const foodsByCaloriesIntake =
			// 	await this.GetModel.getFoodsBasedCalorieIntake(calorieIntake);

			// return foodsByCaloriesIntake;

			// let foodRecommendation = await this.foodRecommendation(tdee);

			const recordedNutrition = await this.GetModel.getRecordedNutrition({
				date,
				uid,
			});

			const breakfast = await this.foodAndQuantity(
				recordedNutrition,
				Mealtime.BREAKFAST,
			);

			const lunch = await this.foodAndQuantity(
				recordedNutrition,
				Mealtime.LUNCH,
			);
			const dinner = await this.foodAndQuantity(
				recordedNutrition,
				Mealtime.DINNER,
			);

			let water = recordedNutrition[0].number_of_cups;

			if (!water) {
				water = null;
			}

			let total_cals: number = 0;
			let total_carbos: number = 0;
			let total_proteins: number = 0;
			let total_fibers: number = 0;
			let total_fats: number = 0;
			let total_glucoses: number = 0;
			let total_sodiums: number = 0;
			let total_caliums: number = 0;

			recordedNutrition.forEach(food => {
				total_cals += food.cals;
				total_carbos += food.carbos;
				total_proteins += food.proteins;
				total_fibers += food.fibers;
				total_fats += food.fats;
				total_glucoses += food.glucoses;
				total_sodiums += food.sodiums;
				total_caliums += food.caliums;
			});

			total_cals = parseFloat(total_cals.toFixed(2));
			total_carbos = parseFloat(total_carbos.toFixed(2));
			total_proteins = parseFloat(total_proteins.toFixed(2));
			total_fibers = parseFloat(total_fibers.toFixed(2));
			total_fats = parseFloat(total_fats.toFixed(2));
			total_glucoses = parseFloat(total_glucoses.toFixed(2));
			total_sodiums = parseFloat(total_sodiums.toFixed(2));
			total_caliums = parseFloat(total_caliums.toFixed(2));

			return {
				// recordedNutrition,
				daily_analysis: {
					TDEE: tdee,
					total_cals,
					total_carbos,
					total_proteins,
					total_fibers,
					total_fats,
					total_glucoses,
					total_sodiums,
					total_caliums,
				},
				record_foods: {
					breakfast,
					lunch,
					dinner,
				},
				// foodRecommentation: foodRecommentation,
				water,
			};
		} catch (error) {
			throw error;
		}
	}
}
