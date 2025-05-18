import api from '../lib/axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';

const API_BASE = '/api/tasks';

export const taskService = {
	async getAll(): Promise<Task[]> {
		const response = await api.get<Task[]>(API_BASE);
		return response.data;
	},

	async getById(id: string): Promise<Task> {
		const response = await api.get<Task>(`${API_BASE}/${id}`);
		return response.data;
	},

	async create(data: CreateTaskDto): Promise<Task> {
		const response = await api.post<Task>(API_BASE, data);
		return response.data;
	},

	async update(id: string, data: UpdateTaskDto): Promise<Task> {
		const response = await api.patch<Task>(`${API_BASE}/${id}`, data);
		return response.data;
	},

	async remove(id: string): Promise<void> {
		await api.delete(`${API_BASE}/${id}`);
	},
};