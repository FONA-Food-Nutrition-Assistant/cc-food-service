import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserNutritionEntity } from 'src/module/food/entities/user-nutrition.entity';
import { WaterEntity } from 'src/module/water/entities/water.entity';
import { NutritionEntity } from 'src/module/food/entities/nutrition.entity';
import { UserEntity } from '../entities/user.entity';
import { FoodEntity } from 'src/module/food/entities/food.entity';
import { NutritionPacketEntity } from '../entities/nutrition_packet.entity';
import { PacketEntity } from '../entities/packet.entity';
import { RequestHomeDto } from '../dto/home.dto';
import { FoodAllergyEntity } from 'src/module/food/entities/food-allergy.entity';
import { UserAllergyEntity } from 'src/module/food/entities/user-allergy.entity';

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
		@InjectRepository(UserEntity)
		private readonly UserRepository: Repository<UserEntity>,
		@InjectRepository(NutritionPacketEntity)
		private readonly NutritionPacketRepository: Repository<NutritionPacketEntity>,
		@InjectRepository(WaterEntity)
		private readonly WaterRepository: Repository<WaterEntity>,
		@InjectRepository(FoodEntity)
		private readonly FoodRepository: Repository<FoodEntity>,
	) {}

	async getRecordedNutrition(params: RequestHomeDto) {
		let query = this.UserNutritionRepository.createQueryBuilder('un')
			.select('u.uid, un.meal_time, un.date, un.quantity, f.name, n.*')
			.leftJoin(NutritionEntity, 'n', 'un.nutrition_id = n.id')
			.leftJoin(UserEntity, 'u', 'un.user_id = u.uid')
			.leftJoin(FoodEntity, 'f', 'n.food_id = f.id')
			.where('un.date = :date', { date: params.date })
			.andWhere('u.uid = :uid', { uid: params.uid });

		return await query.getRawMany();
	}

	async getRecordedWater(params: RequestHomeDto) {
		let query = this.WaterRepository.createQueryBuilder()
			.select('number_of_cups')
			.where('date = :date', { date: params.date })
			.andWhere('user_id = :uid', { uid: params.uid });

		return await query.getRawMany();
	}

	async getFoodsBasedCalorieIntake(calorieIntake: Object) {
		let query_breakfast = this.NutritionPacketRepository.createQueryBuilder(
			'np',
		)
			.select(
				'p.id, p.name as packet_name, f.id as food_id, f.name as food_name, p.total_cals',
			)
			.leftJoin(PacketEntity, 'p', 'p.id = np.packet_id')
			.leftJoin(NutritionEntity, 'n', 'n.id = np.nutrition_id')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.where(
				'p.total_cals >= :lowestBreakfastIntake and p.total_cals <= :highestBreakfastIntake',
				{
					lowestBreakfastIntake: calorieIntake['lowestBreakfastIntake'],
					highestBreakfastIntake: calorieIntake['highestBreakfastIntake'],
				},
			);

		let query_lunch = this.NutritionPacketRepository.createQueryBuilder('np')
			.select(
				'p.id, p.name as packet_name, f.id as food_id, f.name as food_name, p.total_cals',
			)
			.leftJoin(PacketEntity, 'p', 'p.id = np.packet_id')
			.leftJoin(NutritionEntity, 'n', 'n.id = np.nutrition_id')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.where(
				'p.total_cals >= :lowestLunchIntake and p.total_cals <= :highestLunchIntake',
				{
					lowestLunchIntake: calorieIntake['lowestDinnerIntake'],
					highestLunchIntake: calorieIntake['highestDinnerIntake'],
				},
			);

		let query_dinner = this.NutritionPacketRepository.createQueryBuilder('np')
			.select(
				'p.id, p.name as packet_name, f.id as food_id, f.name as food_name, p.total_cals',
			)
			.leftJoin(PacketEntity, 'p', 'p.id = np.packet_id')
			.leftJoin(NutritionEntity, 'n', 'n.id = np.nutrition_id')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.where(
				'p.total_cals >= :lowestDinnerIntake and p.total_cals <= :highestDinnerIntake',
				{
					lowestDinnerIntake: calorieIntake['lowestDinnerIntake'],
					highestDinnerIntake: calorieIntake['highestDinnerIntake'],
				},
			);

		return {
			query_breakfast: await query_breakfast.getRawMany(),
			query_lunch: await query_lunch.getRawMany(),
			query_dinner: await query_dinner.getRawMany(),
		};
	}

	async getUserById(uid: string) {
		let query = this.UserRepository.createQueryBuilder('u')
			.select('u.*')
			.where('uid = :uid', { uid });

		return await query.getRawOne();
	}

	async getFoodsByUserAllergies(uid: string) {
		let query = this.FoodRepository.createQueryBuilder('f')
			.select('f.id')
			.leftJoin(FoodAllergyEntity, 'fa', 'fa.food_id = f.id')
			.leftJoin(UserAllergyEntity, 'ua', 'ua.allergy_id = fa.allergy_id')
			.where('ua.user_id = :uid', { uid });

		return await query.getRawMany();
	}
}
