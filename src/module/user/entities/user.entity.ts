import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
	@PrimaryColumn()
	@Index()
	uid: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	email: string;

	@Column({ type: 'int', nullable: false })
	height: number;

	@Column({ type: 'int', nullable: false })
	weight: number;

	@Column({ type: 'int', nullable: false })
	activity: number;

	@Column({ type: 'int', nullable: false })
	gender: number; // ganti ke enum (laki-laki & perempuan)

	@Column({ type: 'date', nullable: false })
	date_of_birth: Date;

	@Column({ type: 'date'})
	created_at: Date;

	@Column({ type: 'date'})
	updated_at: Date;
}
