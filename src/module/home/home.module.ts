import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetModel } from './models/get.model';
import { UserEntity } from './entities/user.entity';
import { PacketEntity } from './entities/packet.entity';
import { UserNutritionEntity } from '../food/entities/user-nutrition.entity';
import { NutritionPacketEntity } from './entities/nutrition_packet.entity';
import { WaterEntity } from '../water/entities/water.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserNutritionEntity,
			UserEntity,
			PacketEntity,
			NutritionPacketEntity,
			WaterEntity,
		]),
	],
	controllers: [HomeController],
	providers: [
		/** Services */
		HomeService,

		/** Models */
		GetModel,
	],
})
export class HomeModule {}
