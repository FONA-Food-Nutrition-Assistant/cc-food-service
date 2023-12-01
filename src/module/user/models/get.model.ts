import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { error } from 'console';
import { ResponseMessage } from 'src/common/message/message.enum';
import {
	HttpException,
	HttpStatus,
} from '@nestjs/common';


@Injectable()
export class GetModel {
	constructor(
		@InjectRepository(UserEntity)
		private readonly UserRepository: Repository<UserEntity>,
	) {}

	async getUsers() {
		try {
			const result = await this.UserRepository.find(); // ganti ke querybuilder
			return result;

		} catch (error) {
			throw error;
		}
	}

	async getUserById(uid) {
		try {
			const result = await this.UserRepository
			.createQueryBuilder('user')
			.where('uid = :uid', { uid: uid })
			.getRawOne()
			.catch(error => {
				console.error("Error while retrieving:", error);
				throw error; // Rethrow the error to handle it where the function is called
			});;
			
			if (!result) throw new HttpException(ResponseMessage.ERR_USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
			
			return result;

		} catch (error) {
			throw error;
		}
	}

	async storeUser({params, uid}) {
		try {
			console.log(params.email)
			const checker = await this.UserRepository
			.createQueryBuilder('user')
			.where('uid = :uid', { uid: uid })
			.orWhere('email = :email', {email: params.email})
			.getRawOne();

			if (checker) {
				throw new HttpException(ResponseMessage.ERR_USER_HAS_BEEN_REGISTERED, HttpStatus.BAD_REQUEST)
			}

			const user = {
				uid: uid,
				email: params.email,
				height: params.height,
				weight: params.weight,
				activity: params.activity,
				gender: params.gender,
				date_of_birth: params.date_of_birth,
				created_at: new Date().toISOString().split('T')[0],
				updated_at: new Date().toISOString().split('T')[0],
			}

			const result = await this.UserRepository
			.createQueryBuilder()
			.insert()
			.values([
				user
			])
			.execute()
			.catch(error => {
				console.error("Error while inserting:", error);
				throw error; // Rethrow the error to handle it where the function is called
			});

			return result;
			
		} catch (error) {
			throw error;
		}
	}

	async updateUser({params, uid}) {
		try {
			const user = await this.UserRepository.createQueryBuilder('user').where('uid = :uid', { uid: uid }).getRawOne();
			
			if (!user) throw new HttpException(ResponseMessage.ERR_USER_NOT_FOUND, HttpStatus.BAD_REQUEST);

			console.log(user);

			const updatedData = {
				email: params.email || user.user_email,
				height: params.height || user.user_height,
				weight: params.weight || user.user_weight,
				activity: params.activity || user.user_activity,
				gender: params.gender || user.user_gender,
				date_of_birth: params.date_of_birth || user.user_date_of_birth,
				created_at: params.created_at || user.user_date_of_birth,
				updated_at: new Date().toISOString().split('T')[0],
			}

			const result = await this.UserRepository
			.createQueryBuilder()
			.update()
			.set(updatedData)
			.where('uid = :uid', { uid: uid })
			.execute()
			.catch(error => {
				console.error("Error while updating:", error);
				throw error; // Rethrow the error to handle it where the function is called
			});
			
			return result;

		} catch (error) {
			throw error;
		}
	}
}
