import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity('food_allergy')
export class FoodAllergyEntity {
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'int', nullable: false })
	food_id: number;

	@Column({ type: 'int', nullable: false })
	allergy_id: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updated_at: Date;
}
