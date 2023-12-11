import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoodController } from './food.controller';

import { FoodService } from './food.service';

import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';
import { DeleteModel } from './models/delete.model';

import { UserNutritionEntity } from './entities/user-nutrition.entity';
import { NutritionEntity } from './entities/nutrition.entity';
import { FoodEntity } from './entities/food.entity';
import { UserAllergyEntity } from './entities/user-allergy.entity';
import { FoodAllergyEntity } from './entities/food-allergy.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			FoodEntity,
			NutritionEntity,
			UserNutritionEntity,
			UserAllergyEntity,
			FoodAllergyEntity,
		]),
	],
	controllers: [FoodController],
	providers: [
		/** Services */
		FoodService,

		/** Models */
		PostModel,
		PutModel,
		GetModel,
		DeleteModel,
	],
})
export class FoodModule {}
