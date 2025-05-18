import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';

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

		const promise = taskService
			.create(data)
			.then((newTask) => {
				set({ tasks: [...get().tasks, newTask] });
				return newTask;
			})
			.catch((err: any) => {
				set({ error: err.message });
				throw err;
			})
			.finally(() => {
				set({ loading: false });
			});

		toast.promise(promise, {
			loading: 'Agregando tarea...',
			success: (data) => `${data.title} ha sido agregada correctamente.`,
			error: 'No se pudo agregar la tarea.',
		});
	},
	updateTask: async (id, data) => {
		console.log(id, data);
		set({ loading: true, error: null });

		const promise = taskService
			.update(id, data)
			.then((updated) => {
				console.log(updated);

				set({
					tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
				});
				if (get().selectedTask?.id === id) {
					set({ selectedTask: updated });
				}
				return updated;
			})
			.catch((err: any) => {
				console.log(err);
				set({ error: err.message });
				throw err;
			})
			.finally(() => {
				set({ loading: false });
			});

		toast.promise(promise, {
			loading: 'Actualizando tarea...',
			success: (data) => `${data.title} ha sido actualizada.`,
			error: 'No se pudo actualizar la tarea.',
		});
	},

	deleteTask: async (id) => {
		set({ loading: true, error: null });

		const promise = taskService
			.remove(id)
			.then(() => {
				set({
					tasks: get().tasks.filter((t) => t.id !== id),
				});
				if (get().selectedTask?.id === id) {
					set({ selectedTask: null });
				}
				return { id }; // Devuelve un objeto mínimo para que `toast.success` tenga contexto
			})
			.catch((err: any) => {
				set({ error: err.message });
				throw err;
			})
			.finally(() => {
				set({ loading: false });
			});

		toast.promise(promise, {
			loading: 'Eliminando tarea...',
			success: () => `Tarea eliminada correctamente.`,
			error: 'No se pudo eliminar la tarea.',
		});
	},
}));
