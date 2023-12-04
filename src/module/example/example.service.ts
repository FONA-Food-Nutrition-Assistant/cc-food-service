import { Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';

@Injectable()
export class ExampleService {
	constructor(private readonly getModel: GetModel) {}

	async getFonaMembersWithLearningPath() {
		return await this.getModel.getFonaMembersWithLearningPath();
	}
}
