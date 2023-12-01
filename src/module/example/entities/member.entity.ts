import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class MemberEntity {
	@PrimaryGeneratedColumn()
	@PrimaryColumn()
	@Index()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 255, nullable: false, unique: true })
	email: string;

	@Column({ type: 'int', nullable: false, foreignKeyConstraintName: 'fk_learning_path_id' })
	learning_path: number;
}
