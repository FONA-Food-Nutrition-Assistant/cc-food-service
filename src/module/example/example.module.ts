import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { GetModel } from './models/get.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPathEntity } from './entities/learning-path.entity';
import { MemberEntity } from './entities/member.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MemberEntity, LearningPathEntity])],
	controllers: [ExampleController],
	providers: [
		/** Services */
		ExampleService,

		/** Models */
		GetModel,
	],
})
export class ExampleModule {}
