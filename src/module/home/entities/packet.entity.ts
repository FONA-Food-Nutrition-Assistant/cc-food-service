import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Timestamp,
} from 'typeorm';

@Entity('packets')
export class PacketEntity {
	@PrimaryGeneratedColumn()
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	name: string;

	@Column({ type: 'int', nullable: false })
	total_cals: number;

	@Column({ type: 'date' })
	created_at: Timestamp;

	@Column({ type: 'date' })
	updated_at: Timestamp;
}
