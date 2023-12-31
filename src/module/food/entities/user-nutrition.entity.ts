import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';

@Entity('user_nutrition')
export class UserNutritionEntity {
	@PrimaryGeneratedColumn('uuid')
	@PrimaryColumn()
	@Index()
	id?: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	user_id: string;

	@Column({ type: 'int', nullable: false })
	nutrition_id: number;

	@Column({ type: 'int', nullable: false })
	quantity: number;

	@Column({ type: 'date', nullable: false })
	date: Date;

	@Column({ type: 'varchar', length: 255, nullable: false })
	meal_time: string;

	@Column({ type: 'date' })
	created_at?: Date;

	@Column({ type: 'date' })
	updated_at?: Date;
}
