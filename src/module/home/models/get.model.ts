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

@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(UserNutritionEntity)
		private readonly UserNutritionRepository: Repository<UserNutritionEntity>,
		@InjectRepository(UserEntity)
		private readonly UserRepository: Repository<UserEntity>,
		@InjectRepository(NutritionPacketEntity)
		private readonly NutritionPacketRepository: Repository<NutritionPacketEntity>,
		@InjectRepository(PacketEntity)
		private readonly PacketRepository: Repository<PacketEntity>,
	) {}

	async getRecordedNutrition({ date, uid }) {
		let query = this.UserNutritionRepository.createQueryBuilder('un')
			.select(
				'u.uid, un.meal_time, un.date, un.quantity, f.name, n.*, w.number_of_cups',
			)
			.leftJoin(NutritionEntity, 'n', 'un.nutrition_id = n.id')
			.leftJoin(UserEntity, 'u', 'un.user_id = u.uid')
			.leftJoin(FoodEntity, 'f', 'n.food_id = f.id')
			.leftJoin(WaterEntity, 'w', 'w.user_id = u.uid')
			.where('un.date = :date', { date })
			.andWhere('u.uid = :uid', { uid });

		return await query.getRawMany();
	}

	async getFoodsBasedCalorieIntake(calorieIntake) {
		console.log(
			calorieIntake.lowestbreakfastIntake,
			calorieIntake.highestbreakfastIntake,
		);

		let query = this.NutritionPacketRepository.createQueryBuilder('np')
			.select('p.name as packet_name, f.name as food_name, p.total_cals')
			.leftJoin(PacketEntity, 'p', 'p.id = np.packet_id')
			.leftJoin(NutritionEntity, 'n', 'n.id = np.nutrition_id')
			.leftJoin(FoodEntity, 'f', 'f.id = n.food_id')
			.where(
				'p.total_cals >= :lowestbreakfastIntake and p.total_cals <= :highestbreakfastIntake',
				{
					lowestbreakfastIntake: calorieIntake.lowestbreakfastIntake,
					highestbreakfastIntake: calorieIntake.highestbreakfastIntake,
				},
			);

		return await query.getRawMany();
	}

	async getUserById(uid) {
		const result = await this.UserRepository.createQueryBuilder('user')
			.select('*')
			.where('uid = :uid', { uid: uid })
			.getRawOne();

		if (!result)
			throw new HttpException(
				ResponseMessage.ERR_USER_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		return result;
	}
}
