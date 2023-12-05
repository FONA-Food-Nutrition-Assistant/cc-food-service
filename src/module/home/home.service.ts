import { Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';

@Injectable()
export class HomeService {
	constructor(private readonly GetModel: GetModel) {}

	async getAllData(params, uid) {
		try {
			const data = await this.GetModel.getAllData({ params, uid });
			return data;
		} catch (error) {
			throw error;
		}
	}
}
