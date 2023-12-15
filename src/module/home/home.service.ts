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

	async foodAndQuantity(recordedNutrition: any[], meal_time: Mealtime) {
		return recordedNutrition
			.filter((food: { meal_time: Mealtime }) => {
				return food.meal_time == meal_time;
			})
			.map(
				(nutrition: {
					food_id: number;
					id: number;
					name: string;
					serving_size: string;
					cals: number;
					quantity: number;
					carbos: number;
					proteins: number;
					fibers: number;
					fats: number;
					glucoses: number;
					sodiums: number;
					caliums: number;
				}) => {
					return {
						food_id: nutrition.food_id,
						nutrition_id: nutrition.id,
						name: nutrition.name,
						serving_size: nutrition.serving_size,
						quantity: nutrition.quantity,
						total_cals: nutrition.cals * nutrition.quantity,
						total_carbos: parseFloat(
							(nutrition.carbos * nutrition.quantity).toFixed(2),
						),
						total_proteins: parseFloat(
							(nutrition.proteins * nutrition.quantity).toFixed(2),
						),
						total_fibers: parseFloat(
							(nutrition.fibers * nutrition.quantity).toFixed(2),
						),
						total_fats: parseFloat(
							(nutrition.fats * nutrition.quantity).toFixed(2),
						),
						total_glucoses: parseFloat(
							(nutrition.glucoses * nutrition.quantity).toFixed(2),
						),
						total_sodiums: parseFloat(
							(nutrition.sodiums * nutrition.quantity).toFixed(2),
						),
						total_caliums: parseFloat(
							(nutrition.caliums * nutrition.quantity).toFixed(2),
						),
					};
				},
			);
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
					cals: total_cals,
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
				proteins: parseFloat((0.1 * tdee).toFixed(2)),
				fats: parseFloat((0.2 * tdee).toFixed(2)),
				carbos: parseFloat((0.45 * tdee).toFixed(2)),
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

			// return breakfast;

			const lunch = await this.foodAndQuantity(
				recordedNutrition,
				Mealtime.LUNCH,
			);

			const dinner = await this.foodAndQuantity(
				recordedNutrition,
				Mealtime.DINNER,
			);

			const recordFoods = {
				breakfast: breakfast.map(val => {
					return {
						food_id: val.food_id,
						nutrition_id: val.nutrition_id,
						name: val.name,
						serving_size: val.serving_size,
						quantity: val.quantity,
						total_cals: val.total_cals,
						total_carbos: val.total_carbos,
						total_proteins: val.total_proteins,
						total_fats: val.total_fats,
						total_fibers: val.total_fibers,
						total_caliums: val.total_caliums,
						total_sodiums: val.total_sodiums,
						total_glucoses: val.total_glucoses,
					};
				}),
				lunch: lunch.map(val => {
					return {
						food_id: val.food_id,
						nutrition_id: val.nutrition_id,
						name: val.name,
						serving_size: val.serving_size,
						quantity: val.quantity,
						total_cals: val.total_cals,
						total_carbos: val.total_carbos,
						total_proteins: val.total_proteins,
						total_fats: val.total_fats,
						total_fibers: val.total_fibers,
						total_caliums: val.total_caliums,
						total_sodiums: val.total_sodiums,
						total_glucoses: val.total_glucoses,
					};
				}),
				dinner: dinner.map(val => {
					return {
						food_id: val.food_id,
						nutrition_id: val.nutrition_id,
						name: val.name,
						serving_size: val.serving_size,
						quantity: val.quantity,
						total_cals: val.total_cals,
						total_carbos: val.total_carbos,
						total_proteins: val.total_proteins,
						total_fats: val.total_fats,
						total_fibers: val.total_fibers,
						total_caliums: val.total_caliums,
						total_sodiums: val.total_sodiums,
						total_glucoses: val.total_glucoses,
					};
				}),
			};

			// end getting user recorded foods

			// start getting user recorded water

			let recordWater = await this.GetModel.getRecordedWater(params);

			if (!recordWater) {
				recordWater = 0;
			} else {
				recordWater = recordWater.number_of_cups;
			}

			// end getting user recorded foods

			// start calculating user recorded nutritions

			let totalCals: number = 0;
			let totalCarbos: number = 0;
			let totalProteins: number = 0;
			let totalFibers: number = 0;
			let totalFats: number = 0;
			let totalGlucoses: number = 0;
			let totalSodiums: number = 0;
			let totalCaliums: number = 0;

			breakfast.forEach(food => {
				totalCals += food.total_cals;
				totalCarbos += food.total_carbos;
				totalProteins += food.total_proteins;
				totalFibers += food.total_fibers;
				totalFats += food.total_fats;
				totalGlucoses += food.total_glucoses;
				totalSodiums += food.total_sodiums;
				totalCaliums += food.total_caliums;
			});

			lunch.forEach(food => {
				totalCals += food.total_cals;
				totalCarbos += food.total_carbos;
				totalProteins += food.total_proteins;
				totalFibers += food.total_fibers;
				totalFats += food.total_fats;
				totalGlucoses += food.total_glucoses;
				totalSodiums += food.total_sodiums;
				totalCaliums += food.total_caliums;
			});

			dinner.forEach(food => {
				totalCals += food.total_cals;
				totalCarbos += food.total_carbos;
				totalProteins += food.total_proteins;
				totalFibers += food.total_fibers;
				totalFats += food.total_fats;
				totalGlucoses += food.total_glucoses;
				totalSodiums += food.total_sodiums;
				totalCaliums += food.total_caliums;
			});

			totalCals = parseFloat(totalCals.toFixed(2));
			totalCarbos = parseFloat(totalCarbos.toFixed(2));
			totalProteins = parseFloat(totalProteins.toFixed(2));
			totalFibers = parseFloat(totalFibers.toFixed(2));
			totalFats = parseFloat(totalFats.toFixed(2));
			totalGlucoses = parseFloat(totalGlucoses.toFixed(2));
			totalSodiums = parseFloat(totalSodiums.toFixed(2));
			totalCaliums = parseFloat(totalCaliums.toFixed(2));

			// end calculating user recorded nutritions

			return {
				calorie_intake: {
					lowest_breakfast_intake: calorieIntake.lowestBreakfastIntake,
					highest_breakfast_intake: calorieIntake.highestBreakfastIntake,
					lowest_lunch_intake: calorieIntake.lowestLunchIntake,
					highest_lunch_intake: calorieIntake.highestLunchIntake,
					lowest_dinner_intake: calorieIntake.lowestDinnerIntake,
					highest_dinner_intake: calorieIntake.highestDinnerIntake,
				},
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
				record_water: recordWater,
				food_suggestion: {
					breakfast: breakfastSuggestion,
					lunch: lunchSuggestion,
					dinner: dinnerSuggestion,
				},
			};
		} catch (error) {
			throw error;
		}
	}
}
