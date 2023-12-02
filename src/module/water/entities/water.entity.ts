import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('waters')
export class WaterEntity {
	@PrimaryGeneratedColumn('uuid')
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	user_id: string;

	@Column({ type: 'int', nullable: false })
	number_of_cups: number;

	@Column({ type: 'date', nullable: false })
	date: Date;

	@Column({ type: 'date' })
	created_at: Date;

	@Column({ type: 'date' })
	updated_at: Date;
}
