import { Module } from '@nestjs/common';
import { RecordWaterController } from './record_water.controller';
import { RecordWaterService } from './record_water.service';
import { GetModel } from './models/get.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordWaterEntity } from './entities/record_water.entity';
import { PostModel } from './models/post.model';
import { PutModel } from './models/put.model';

@Module({
	imports: [TypeOrmModule.forFeature([RecordWaterEntity])],
	controllers: [RecordWaterController],
	providers: [
		/** Services */
		RecordWaterService,

		/** Models */
		GetModel,
		PostModel,
		PutModel,
	],
})
export class RecordWaterModule {}
