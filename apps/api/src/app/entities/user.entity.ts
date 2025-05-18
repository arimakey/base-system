import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Role } from '../auth/enums/role.enum';

@Entity('users')
export class UserEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	email: string;

	@Column()
	name: string;

	@Column('simple-array')
	roles: Role[];

	@Column({ nullable: true })
	googleId: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
	updatedAt: Date;
}
