import { create } from 'zustand';
import { Task } from '../types/tasks.interface';

interface TaskStore {
	selectedTask: Task | null;
	setSelectedTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
	selectedTask: null,
	setSelectedTask: (task) => set({ selectedTask: task }),
}));
