import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';
import { Mealtime } from '../../common/enum/meal_time.enum';
import { CalculationHelper } from '../../util/calculationHelper';
import { RequestHomeDto } from './dto/home.dto';
import { ResponseMessage } from 'src/common/message/message.enum';
import { UserEntity } from './entities/user.entity';
import { Gender } from 'src/common/enum/gender.enum';
import { Activity } from 'src/common/enum/activity.enum';

type foodSuggestion = {
	id: number;
	name: string;
	total_cals: number;
	foods: Array<{ name: string }>;
};

type query = {
	packet_name: string;
	food_name: string;
	total_cals: number;
	id: number;
	food_id: number;
};

@Injectable()
export class HomeService {
	private readonly calculationHelper = new CalculationHelper();

	constructor(private readonly GetModel: GetModel) {}

	async foodAndQuantity(recordedNutrition: Object[], meal_time: Mealtime) {
		return recordedNutrition
			.filter((food: { meal_time: Mealtime }) => {
				return food.meal_time == meal_time;
			})
			.map((food: { name: any; cals: number; quantity: number }) => {
				return {
					name: food.name,
					total_cals: food.cals * food.quantity,
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
		const tolerance = 0.015;

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

	async convertArrayOfObject(query: Array<query>) {
		return Object.values(
			query.reduce((acc, curr) => {
				const { packet_name, food_name, total_cals, id, food_id } = curr;

				if (!acc[packet_name]) {
					acc[packet_name] = {
						id,
						name: packet_name,
						total_cals: total_cals,
						foods: [],
					};
				}

				acc[packet_name].foods.push({
					id: food_id,
					name: food_name,
				});

				return acc;
			}, {}),
		);
	}

	async getAllData(params: RequestHomeDto) {
		try {
			// start retrieving user data and user daily needs

			const user = await this.GetModel.getUserById(params.uid);

			if (!user)
				throw new HttpException(
					ResponseMessage.ERR_USER_NOT_FOUND,
					HttpStatus.BAD_REQUEST,
				);

			const tdee = await this.getTdee(user);

			const dailyNeeds: Object = {
				TDEE: tdee,
				proteins: (0.1 * tdee).toFixed(2),
				fats: (0.2 * tdee).toFixed(2),
				carbos: (0.45 * tdee).toFixed(2),
			};

			// end retrieving user data and user daily needs

			// start getting user foods suggestion

			let calorieIntake = await this.calorieIntake(tdee);

			const foodsByCaloriesIntake =
				await this.GetModel.getFoodsBasedCalorieIntake(calorieIntake);

			let breakfastSuggestion: foodSuggestion;
			let lunchSuggestion: foodSuggestion;
			let dinnerSuggestion: foodSuggestion;

			let userAllergies = await this.GetModel.getFoodsByUserAllergies(
				params.uid,
			);

			userAllergies = userAllergies.map(val => val.f_id);

			let breakfastArrOfObj = await this.convertArrayOfObject(
				foodsByCaloriesIntake.query_breakfast,
			);

			breakfastArrOfObj = breakfastArrOfObj.filter(val => {
				return (
					val['foods'].some((item: { id: number }) =>
						userAllergies.includes(item.id),
					) == false
				);
			});

			let lunchArrOfObj = await this.convertArrayOfObject(
				foodsByCaloriesIntake.query_lunch,
			);

			lunchArrOfObj = lunchArrOfObj.filter(val => {
				return (
					val['foods'].some((item: { id: number }) =>
						userAllergies.includes(item.id),
					) == false
				);
			});

			let dinnerArrOfObj = await this.convertArrayOfObject(
				foodsByCaloriesIntake.query_dinner,
			);

			dinnerArrOfObj = dinnerArrOfObj.filter(val => {
				return (
					val['foods'].some((item: { id: number }) =>
						userAllergies.includes(item.id),
					) == false
				);
			});

			let foodsSuggestionArr: Array<number> = [];

			breakfastSuggestion = breakfastArrOfObj[
				Math.floor(Math.random() * breakfastArrOfObj.length)
			] as foodSuggestion;

			foodsSuggestionArr.push(breakfastSuggestion.id);

			do {
				lunchSuggestion = lunchArrOfObj[
					Math.floor(Math.random() * lunchArrOfObj.length)
				] as foodSuggestion;
			} while (foodsSuggestionArr.includes(lunchSuggestion.id));

			foodsSuggestionArr.push(lunchSuggestion.id);

			do {
				dinnerSuggestion = dinnerArrOfObj[
					Math.floor(Math.random() * dinnerArrOfObj.length)
				] as foodSuggestion;
			} while (foodsSuggestionArr.includes(dinnerSuggestion.id));

			foodsSuggestionArr.push(dinnerSuggestion.id);

			// end getting user foods suggestion

			// start getting user recorded foods

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

			const recordFoods = {
				breakfast,
				lunch,
				dinner,
			};

			let recordWater = await this.GetModel.getRecordedWater(params);

			if (!recordWater) {
				recordWater = 0;
			} else {
				recordWater = recordWater.number_of_cups;
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
				daily_needs: dailyNeeds,
				daily_analysis: {
					total_cals: totalCals,
					total_carbos: totalCarbos,
					total_proteins: totalProteins,
					total_fibers: totalFibers,
					total_fats: totalFats,
					total_glucoses: totalGlucoses,
					total_sodiums: totalSodiums,
					total_caliums: totalCaliums,
				},
				record_foods: recordFoods,
				food_suggestion: {
					breakfast: breakfastSuggestion,
					lunch: lunchSuggestion,
					dinner: dinnerSuggestion,
				},
				record_water: recordWater,
			};
		} catch (error) {
			throw error;
		}
	}
}
