import { Injectable } from '@nestjs/common';
import {
	RequestListAllergyDto,
	ResponseListAllergyDto,
} from './dto/list-allergy.dto';
import { GetModel } from './models/get.model';

@Injectable()
export class AllergyService {
	constructor(private readonly GetModel: GetModel) {}

	async getAllergy(params: RequestListAllergyDto) {
		try {
			const data = await this.GetModel.getAllergy(params);
			return data as ResponseListAllergyDto[];
		} catch (error) {
			throw error;
		}
	}
}
