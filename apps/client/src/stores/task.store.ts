import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';
import { taskService } from '../services/task.service';

interface TaskState {
	tasks: Task[];
	selectedTask: Task | null;
	loading: boolean;
	error: string | null;

	fetchTasks: () => Promise<void>;
	selectTask: (task: Task | null) => void;
	fetchTaskById: (id: string) => Promise<void>;
	createTask: (data: CreateTaskDto) => Promise<void>;
	updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
	tasks: [],
	selectedTask: null,
	loading: false,
	error: null,

	fetchTasks: async () => {
		set({ loading: true, error: null });
		try {
			const tasks = await taskService.getAll();
			set({ tasks });
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	selectTask: (task) => set({ selectedTask: task }),

	fetchTaskById: async (id) => {
		set({ loading: true, error: null });
		try {
			const task = await taskService.getById(id);
			set({ selectedTask: task });
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	createTask: async (data) => {
		set({ loading: true, error: null });
		try {
			const newTask = await taskService.create(data);
			set({ tasks: [...get().tasks, newTask] });
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	updateTask: async (id, data) => {
		set({ loading: true, error: null });
		try {
			const updated = await taskService.update(id, data);
			set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
			// also update selected if open
			if (get().selectedTask?.id === id) {
				set({ selectedTask: updated });
			}
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	deleteTask: async (id) => {
		set({ loading: true, error: null });
		try {
			await taskService.remove(id);
			set({ tasks: get().tasks.filter((t) => t.id !== id) });
			if (get().selectedTask?.id === id) {
				set({ selectedTask: null });
			}
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},
}));
