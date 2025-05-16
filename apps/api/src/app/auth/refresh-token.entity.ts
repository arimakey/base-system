import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_tokens') // Nombre explícito para la tabla
export class RefreshToken {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 500 })
	token: string;

	@Column()
	userId: string;

	@Column()
	expiresAt: Date;

	@Column({ default: false })
	revoked: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
