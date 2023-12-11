import { Module } from '@nestjs/common';
import { AllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllergyEntity } from '../food/entities/allergy.entity';
import { GetModel } from './models/get.model';

@Module({
	imports: [TypeOrmModule.forFeature([AllergyEntity])],
	controllers: [AllergyController],
	providers: [
		/** Services */
		AllergyService,

		/** Models */
		GetModel,
	],
})
export class AllergyModule {}
