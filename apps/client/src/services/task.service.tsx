// src/services/taskService.ts
import axios from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';
import { useUserStore } from '../stores/user.store';

const API_BASE = '/api/tasks';

// Función para obtener el header con el token actual
function authHeader() {
	const token = useUserStore.getState().token;
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
}

export const taskService = {
	async getAll(): Promise<Task[]> {
        console.log(authHeader());
		const response = await axios.get<Task[]>(API_BASE, authHeader());
		return response.data;
	},

	async getById(id: string): Promise<Task> {
		const response = await axios.get<Task>(
			`${API_BASE}/${id}`,
			authHeader()
		);
		return response.data;
	},

	async create(data: CreateTaskDto): Promise<Task> {
		const response = await axios.post<Task>(API_BASE, data, authHeader());
		return response.data;
	},

	async update(id: string, data: UpdateTaskDto): Promise<Task> {
		const response = await axios.put<Task>(
			`${API_BASE}/${id}`,
			data,
			authHeader()
		);
		return response.data;
	},

	async remove(id: string): Promise<void> {
		await axios.delete(`${API_BASE}/${id}`, authHeader());
	},
};
