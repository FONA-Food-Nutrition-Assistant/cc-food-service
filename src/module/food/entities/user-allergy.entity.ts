import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity('user_allergy')
export class UserAllergyEntity {
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	@Unique(['user_id', 'allergy_id'])
	user_id: string;

	@Column({ type: 'int', nullable: false })
	@Unique(['user_id', 'allergy_id'])
	allergy_id: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updated_at: Date;
}
