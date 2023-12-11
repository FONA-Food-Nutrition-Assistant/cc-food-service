import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Timestamp,
} from 'typeorm';

@Entity('nutrition_packet')
export class NutritionPacketEntity {
	@PrimaryGeneratedColumn()
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'int', nullable: false })
	packet_id: number;

	@Column({ type: 'int', nullable: false })
	nutrition_id: number;

	@Column({ type: 'date' })
	created_at: Timestamp;

	@Column({ type: 'date' })
	updated_at: Timestamp;
}
