import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetModel } from './models/get.model';
import { FoodEntity } from '../food/entities/food.entity';
import { FoodService } from '../food/food.service';

@Module({
	imports: [TypeOrmModule.forFeature([FoodEntity])],
	controllers: [HomeController],
	providers: [
		/** Services */
		FoodService,

		/** Models */
		GetModel,
	],
})
export class FoodModule {}
