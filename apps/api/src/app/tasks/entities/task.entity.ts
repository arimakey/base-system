import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Assuming you have a User entity for TypeORM.
// If not, userId will just be a string.
// For this example, let's assume no direct User entity relation in Task entity for simplicity,
// and userId will be stored directly. If you have a User entity, you'd link it with @ManyToOne.

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column()
  userId: string; // Stores the ID of the user who owns the task

  // If you have a User entity and want a direct relation:
  // @ManyToOne(() => User, user => user.tasks) // Assuming User entity has a 'tasks' relation
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
