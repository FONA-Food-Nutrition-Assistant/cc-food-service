import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_food')
export class RecordFoodEntity {
	@PrimaryGeneratedColumn('uuid')
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	user_id: string;

	@Column({ type: 'int', nullable: false })
	food_id: number;
	
	@Column({ type: 'int', nullable: false })
	quantity: number;

	@Column({ type: 'date', nullable: false })
	date: Date;

	@Column({ type: 'date' })
	created_at: Date;

	@Column({ type: 'date' })
	updated_at: Date;
}
