import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';

interface TaskState {
	tasks: Task[];
	selectedTask: Task | null;
	loadingFetch: boolean;
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
	loadingFetch: false,
	error: null,

	fetchTasks: async () => {
		set({ loadingFetch: true, error: null });
		try {
			const tasks = await taskService.getAll();
			set({ tasks });
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loadingFetch: false });
		}
	},

	selectTask: (task) => set({ selectedTask: task }),

	fetchTaskById: async (id) => {
		set({ loadingFetch: true, error: null });
		try {
			const task = await taskService.getById(id);
			set({ selectedTask: task });
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loadingFetch: false });
		}
	},

	createTask: async (data) => {
		// Optimistic update
		const tempId = `temp-${Date.now()}`;
		const optimisticTask: Task = { ...data, id: tempId } as Task;
		const prevTasks = get().tasks;
		set({ tasks: [...prevTasks, optimisticTask] });

		const promise = taskService
			.create(data)
			.then((newTask) => {
				set({
					tasks: get().tasks.map((t) =>
						t.id === tempId ? newTask : t
					),
				});
				return newTask;
			})
			.catch((err: any) => {
				set({ tasks: prevTasks, error: err.message });
				throw err;
			});

		toast.promise(promise, {
			loading: 'Agregando tarea...',
			success: (data) => `${data.title} ha sido agregada correctamente.`,
			error: 'No se pudo agregar la tarea.',
		});
	},

	updateTask: async (id, data) => {
		const prevTasks = get().tasks;
		const prevSelected = get().selectedTask;
		const updatedTask = {
			...prevTasks.find((t) => t.id === id),
			...data,
		} as Task;

		// Optimistic update
		set({
			tasks: prevTasks.map((t) => (t.id === id ? updatedTask : t)),
		});
		if (prevSelected?.id === id) {
			set({ selectedTask: updatedTask });
		}

		const promise = taskService
			.update(id, data)
			.then((updated) => {
				set({
					tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
				});
				if (get().selectedTask?.id === id) {
					set({ selectedTask: updated });
				}
				return updated;
			})
			.catch((err: any) => {
				set({
					tasks: prevTasks,
					selectedTask: prevSelected,
					error: err.message,
				});
				throw err;
			});

		toast.promise(promise, {
			loading: 'Actualizando tarea...',
			success: (data) => `${data.title} ha sido actualizada.`,
			error: 'No se pudo actualizar la tarea.',
		});
	},

	deleteTask: async (id) => {
		const prevTasks = get().tasks;
		const prevSelected = get().selectedTask;

		// Optimistic update
		set({
			tasks: prevTasks.filter((t) => t.id !== id),
		});
		if (prevSelected?.id === id) {
			set({ selectedTask: null });
		}

		const promise = taskService
			.remove(id)
			.then(() => {
				return { id };
			})
			.catch((err: any) => {
				set({
					tasks: prevTasks,
					selectedTask: prevSelected,
					error: err.message,
				});
				throw err;
			});

		toast.promise(promise, {
			loading: 'Eliminando tarea...',
			success: () => `Tarea eliminada correctamente.`,
			error: 'No se pudo eliminar la tarea.',
		});
	},
}));
