import { Module } from '@nestjs/common';
import { RecordFoodController } from './record_food.controller';
import { RecordFoodService } from './record_food.service';
import { GetModel } from './models/get.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordFoodEntity } from './entities/record_food.entity';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Module({
	imports: [TypeOrmModule.forFeature([RecordFoodEntity])],
	controllers: [RecordFoodController],
	providers: [
		/** Services */
		RecordFoodService,

		/** Models */
		GetModel,
		PostModel,
		PutModel,
	],
})
export class RecordFoodModule {}
