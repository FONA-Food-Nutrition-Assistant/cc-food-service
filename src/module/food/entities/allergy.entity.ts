import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('allergies')
export class AllergyEntity {
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'timestamp' })
	created_at: Date;

	@Column({ type: 'timestamp' })
	updated_at: Date;
}
