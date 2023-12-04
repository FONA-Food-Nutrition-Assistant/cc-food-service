import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('nutritions')
export class NutritionEntity {
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	serving_size: string;

	@Column({ type: 'int', nullable: false })
	cals: number;

	@Column({ type: 'float', nullable: true })
	carbos: number;

	@Column({ type: 'float', nullable: true })
	proteins: number;

	@Column({ type: 'float', nullable: true })
	fibers: number;

	@Column({ type: 'float', nullable: true })
	fats: number;

	@Column({ type: 'float', nullable: true })
	glucoses: number;

	@Column({ type: 'float', nullable: true })
	sodiums: number;

	@Column({ type: 'float', nullable: true })
	kaliums: number;

	@Column({ type: 'int', nullable: false })
	food_id: number;
}
