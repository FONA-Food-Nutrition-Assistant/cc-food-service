import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('record_waters')
export class RecordWaterEntity {
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
}
