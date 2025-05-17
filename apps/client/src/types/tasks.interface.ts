export enum TaskStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
}

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: TaskStatus;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateTaskDto {
	title: string;
	description?: string;
	status?: TaskStatus;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;
