import { Injectable } from '@nestjs/common';
import { GetModel } from './models/get.model';

@Injectable()
export class UserService {
	constructor(private readonly getModel: GetModel) {}

	async getUsers() {
		return await this.getModel.getUsers();
	}

	async getUserById(uid) {
		try {
			const user = await this.getModel.getUserById(uid);
			return user;
		} catch(error) {
			throw error;
		}
	}

	async storeUser(params, uid) {
		try {
			const user = await this.getModel.storeUser({params, uid});
			return user;
		} catch(error) {
			throw error;
		}
	}

	async updateUser(params, uid) {
		try {
			const user = await this.getModel.updateUser({params, uid});
			return user;
		} catch(error) {
			throw error;
		}
	}
}
