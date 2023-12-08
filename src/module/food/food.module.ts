import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNutritionEntity } from './entities/user-nutrition.entity';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { NutritionEntity } from './entities/nutrition.entity';
import { FoodEntity } from './entities/food.entity';
import { GetModel } from './models/get.model';
import { UserAllergyEntity } from './entities/user-allergy.entity';
import { DeleteModel } from './models/delete.model';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			FoodEntity,
			NutritionEntity,
			UserNutritionEntity,
			UserAllergyEntity,
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
