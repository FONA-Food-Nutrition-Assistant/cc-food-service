import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('foods')
export class FoodEntity {
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;
}
