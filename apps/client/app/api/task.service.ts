import { CreateTaskDto, Task, UpdateTaskDto } from '../types/tasks.interface';
import { useUserStore } from '../store/user.store';
const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
	Authorization: `Bearer ${useUserStore.getState().token}`,
	'Content-Type': 'application/json',
});

export const fetchTasks = async (): Promise<Task[]> => {
	const res = await fetch(`${API_URL}/tasks`, { headers: authHeader() });
	if (!res.ok) throw new Error('Error loading tasks');
	return res.json();
};

export const createTask = async (dto: CreateTaskDto): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks`, {
		method: 'POST',
		headers: authHeader(),
		body: JSON.stringify(dto),
	});
	if (!res.ok) throw new Error('Error creating task');
	return res.json();
};

export const updateTask = async ({
	id,
	data,
}: {
	id: string;
	data: UpdateTaskDto;
}): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks/${id}`, {
		method: 'PATCH',
		headers: authHeader(),
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Error updating task');
	return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
	const res = await fetch(`${API_URL}/tasks/${id}`, {
		method: 'DELETE',
		headers: authHeader(),
	});
	if (!res.ok) throw new Error('Error deleting task');
};
