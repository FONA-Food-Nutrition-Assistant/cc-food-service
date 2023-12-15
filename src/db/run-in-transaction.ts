import { Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export const runInTransaction = async <T>(
	ds: DataSource,
	fn: (entityManager: EntityManager) => Promise<T>,
): Promise<T> => {
	const queryRunner = ds.createQueryRunner('master');

	try {
		await queryRunner.connect();
		await queryRunner.startTransaction();

		const entityManager: EntityManager = queryRunner.manager;
		const result: T = await fn(entityManager);

		await queryRunner.commitTransaction();
		return result;
	} catch (err) {
		await queryRunner.rollbackTransaction();
		return Promise.reject(err);
	} finally {
		await queryRunner.release();
	}
};
