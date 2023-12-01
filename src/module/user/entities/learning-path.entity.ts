import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('learning_paths')
export class LearningPathEntity {
	@PrimaryGeneratedColumn()
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 2, nullable: false })
	alias: string;

	@Column({ type: 'varchar', length: 100, nullable: false })
	name: string;
}
