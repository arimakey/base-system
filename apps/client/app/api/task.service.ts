import { CreateTaskDto, Task, UpdateTaskDto } from '../types/tasks.interface';
import { useUserStore } from '../store/user.store';

// Usamos el proxy definido en el cliente (por ejemplo, en package.json: "proxy": "http://localhost:3000")
// y por tanto apuntamos a la ruta relativa /api
const API_URL = '/api';

const authHeader = () => {
	const token = useUserStore.getState().token;
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	};
};

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
