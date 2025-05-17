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
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaskDto {
	title: string;
	description?: string;
	status?: TaskStatus;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
