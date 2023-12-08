import { Module } from '@nestjs/common';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterEntity } from './entities/water.entity';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';
import { GetModel } from './models/get.model';

@Module({
	imports: [TypeOrmModule.forFeature([WaterEntity])],
	controllers: [WaterController],
	providers: [
		/** Services */
		WaterService,

		/** Models */
		PostModel,
		PutModel,
		GetModel,
	],
})
export class WaterModule {}
