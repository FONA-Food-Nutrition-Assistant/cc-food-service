import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';
import { Mealtime } from '../../common/enum/meal_time.enum';
import { CalculationHelper } from '../../util/calculationHelper';
import { RequestHomeDto } from './dto/home.dto';
import { ResponseMessage } from 'src/common/message/message.enum';
import { UserEntity } from './entities/user.entity';
import { Gender } from 'src/common/enum/gender.enum';
import { Activity } from 'src/common/enum/activity.enum';
@Injectable()
export class HomeService {
	private readonly calculationHelper = new CalculationHelper();

	constructor(private readonly GetModel: GetModel) {}

	async foodAndQuantity(recordedNutrition: any[], meal_time: Mealtime) {
		return recordedNutrition
			.filter((food: { meal_time: any }) => {
				return food.meal_time == meal_time;
			})
			.map((food: { name: any; quantity: any }) => {
				return {
					name: food.name,
					quantity: food.quantity,
				};
			});
	}

	async getTdee(user: UserEntity) {
		const age = this.calculationHelper.calculateAge(user.date_of_birth);

		let tdee = parseFloat(
			this.calculationHelper
				.calculateTDEE(
					user.weight,
					user.height,
					age,
					user.gender as Gender,
					user.activity as Activity,
				)
				.toFixed(2),
		);

		return tdee;
	}

	async calorieIntake(tdee: number) {
		const tolerance = 0.01;

		const lowestBreakfastIntake = Math.round((0.3 - tolerance) * tdee);
		const highestBreakfastIntake = Math.round((0.35 + tolerance) * tdee);

		const lowestLunchIntake = Math.round((0.35 - tolerance) * tdee);
		const highestLunchIntake = Math.round((0.4 + tolerance) * tdee);

		const lowestDinnerIntake = Math.round((0.25 - tolerance) * tdee);
		const highestDinnerIntake = Math.round((0.35 + tolerance) * tdee);

		return {
			lowestBreakfastIntake,
			highestBreakfastIntake,
			lowestLunchIntake,
			highestLunchIntake,
			lowestDinnerIntake,
			highestDinnerIntake,
		};
	}

	async foodRecommendation(tdee: any) {}

	async getAllData(params: RequestHomeDto) {
		try {
			const user = await this.GetModel.getUserById(params.uid);

			if (!user)
				throw new HttpException(
					ResponseMessage.ERR_USER_NOT_FOUND,
					HttpStatus.BAD_REQUEST,
				);

			const tdee = await this.getTdee(user);

			let calorieIntake = await this.calorieIntake(tdee);

			const foodsByCaloriesIntake =
				await this.GetModel.getFoodsBasedCalorieIntake(calorieIntake);

			return foodsByCaloriesIntake;

			let foodRecommendation = await this.foodRecommendation(tdee);

			const recordedNutrition = await this.GetModel.getRecordedNutrition(
				params,
			);

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

			let water = await this.GetModel.getRecordedWater(params);

			if (!water) {
				water = null;
			}

			let totalCals: number = 0;
			let totalCarbos: number = 0;
			let totalProteins: number = 0;
			let totalFibers: number = 0;
			let totalFats: number = 0;
			let totalGlucoses: number = 0;
			let totalSodiums: number = 0;
			let totalCaliums: number = 0;

			recordedNutrition.forEach(food => {
				totalCals += food.cals;
				totalCarbos += food.carbos;
				totalProteins += food.proteins;
				totalFibers += food.fibers;
				totalFats += food.fats;
				totalGlucoses += food.glucoses;
				totalSodiums += food.sodiums;
				totalCaliums += food.caliums;
			});

			totalCals = parseFloat(totalCals.toFixed(2));
			totalCarbos = parseFloat(totalCarbos.toFixed(2));
			totalProteins = parseFloat(totalProteins.toFixed(2));
			totalFibers = parseFloat(totalFibers.toFixed(2));
			totalFats = parseFloat(totalFats.toFixed(2));
			totalGlucoses = parseFloat(totalGlucoses.toFixed(2));
			totalSodiums = parseFloat(totalSodiums.toFixed(2));
			totalCaliums = parseFloat(totalCaliums.toFixed(2));

			return {
				recordedNutrition,
				daily_analysis: {
					TDEE: tdee,
					total_cals: totalCals,
					total_carbos: totalCarbos,
					total_proteins: totalProteins,
					total_fibers: totalFibers,
					total_fats: totalFats,
					total_glucoses: totalGlucoses,
					total_sodiums: totalSodiums,
					total_caliums: totalCaliums,
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
