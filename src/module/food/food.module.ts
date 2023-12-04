import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodEntity } from './entities/food.entity';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Module({
	imports: [TypeOrmModule.forFeature([FoodEntity])],
	controllers: [FoodController],
	providers: [
		/** Services */
		FoodService,

		/** Models */
		PostModel,
		PutModel,
	],
})
export class FoodModule {}
