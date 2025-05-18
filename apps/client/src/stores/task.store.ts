import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/tasks.interface';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';

interface TaskState {
	tasks: Task[];
	selectedTask: Task | null;
	loadingFetch: boolean;
	error: string | null;
 	searchTerm: string;
	filteredTasks: Task[];

	fetchTasks: () => Promise<void>;
	selectTask: (task: Task | null) => void;
	fetchTaskById: (id: string) => Promise<void>;
	createTask: (data: CreateTaskDto) => Promise<void>;
	updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	setSearchTerm: (term: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
	tasks: [],
	selectedTask: null,
	loadingFetch: false,
	error: null,
	searchTerm: '',
	filteredTasks: [],

	fetchTasks: async () => {
		set({ loadingFetch: true, error: null });
		try {
			const tasks = await taskService.getAll();
			set({ tasks, filteredTasks: tasks });
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
		const prevFiltered = get().filteredTasks;
		const { searchTerm } = get();
		
		// Actualizar tasks
		set({ tasks: [...prevTasks, optimisticTask] });
		
		// Actualizar filteredTasks si la nueva tarea cumple con el criterio de búsqueda
		if (!searchTerm.trim() || 
			data.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
			(data.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) {
			set({ filteredTasks: [...prevFiltered, optimisticTask] });
		}

		const promise = taskService
			.create(data)
			.then((newTask) => {
				// Actualizar la tarea en el array de tareas
				const updatedTasks = get().tasks.map((t) =>
					t.id === tempId ? newTask : t
				);
				set({ tasks: updatedTasks });
				
				// Actualizar también en filteredTasks si existe
				if (get().filteredTasks.some(t => t.id === tempId)) {
					set({
						filteredTasks: get().filteredTasks.map((t) =>
							t.id === tempId ? newTask : t
						),
					});
				}
				return newTask;
			})
			.catch((err: any) => {
				set({ 
					tasks: prevTasks, 
					filteredTasks: prevFiltered,
					error: err.message 
				});
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
		const prevFiltered = get().filteredTasks;
		const prevSelected = get().selectedTask;
		const { searchTerm } = get();
		const updatedTask = {
			...prevTasks.find((t) => t.id === id),
			...data,
		} as Task;

		// Optimistic update para tasks
		set({
			tasks: prevTasks.map((t) => (t.id === id ? updatedTask : t)),
		});
		
		// Actualizar filteredTasks
		const taskInFiltered = prevFiltered.some(t => t.id === id);
		const matchesSearch = !searchTerm.trim() || 
			updatedTask.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
			(updatedTask.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
		
		if (taskInFiltered && matchesSearch) {
			// La tarea estaba en filtrados y sigue cumpliendo el criterio
			set({
				filteredTasks: prevFiltered.map((t) => (t.id === id ? updatedTask : t)),
			});
		} else if (taskInFiltered && !matchesSearch) {
			// La tarea estaba en filtrados pero ya no cumple el criterio
			set({
				filteredTasks: prevFiltered.filter((t) => t.id !== id),
			});
		} else if (!taskInFiltered && matchesSearch) {
			// La tarea no estaba en filtrados pero ahora cumple el criterio
			set({
				filteredTasks: [...prevFiltered, updatedTask],
			});
		}
		
		// Actualizar selectedTask si es necesario
		if (prevSelected?.id === id) {
			set({ selectedTask: updatedTask });
		}

		const promise = taskService
			.update(id, data)
			.then((updated) => {
				// Actualizar en tasks
				set({
					tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
				});
				
				// Actualizar en filteredTasks si es necesario
				if (get().filteredTasks.some(t => t.id === id)) {
					set({
						filteredTasks: get().filteredTasks.map((t) => (t.id === id ? updated : t)),
					});
				}
				
				// Actualizar selectedTask si es necesario
				if (get().selectedTask?.id === id) {
					set({ selectedTask: updated });
				}
				return updated;
			})
			.catch((err: any) => {
				set({
					tasks: prevTasks,
					filteredTasks: prevFiltered,
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
		const prevFiltered = get().filteredTasks;
		const prevSelected = get().selectedTask;

		// Optimistic update
		set({
			tasks: prevTasks.filter((t) => t.id !== id),
			filteredTasks: prevFiltered.filter((t) => t.id !== id),
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
					filteredTasks: prevFiltered,
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

	setSearchTerm: (term) => {
		set({ searchTerm: term });
		const { tasks } = get();
		
		if (!term.trim()) {
			set({ filteredTasks: tasks });
			return;
		}
		
		const searchTermLower = term.toLowerCase();
		const filtered = tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(searchTermLower) ||
				(task.description?.toLowerCase().includes(searchTermLower) ?? false)
		);
		
		set({ filteredTasks: filtered });
	},
}));
