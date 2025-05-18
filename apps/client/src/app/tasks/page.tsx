import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStore } from '../../stores/task.store';
import { TaskList } from './records/task.list';
import { TaskSortableSkeleton } from './records/task.skeleton';
import { Button } from '../components/Button';
import { TaskDialogRouter } from './dialogs/task.dialog';

const schema = z.object({
	title: z.string().min(1, 'Título es obligatorio'),
	description: z.string().min(1, 'Descripción es obligatoria'),
});
type FormData = z.infer<typeof schema>;

export default function GestorTareas() {
	const {
		tasks,
		fetchTasks,
		createTask,
		updateTask,
		deleteTask,
		loadingFetch,
		error,
	} = useTaskStore();
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'delete'>(
		'create'
	);
	const [isOpen, setIsOpen] = useState(false);
	const [currentId, setCurrentId] = useState<string | null>(null);
	const [order, setOrder] = useState<string[]>([]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);
	useEffect(() => setOrder(tasks.map((t) => t.id)), [tasks]);
	useEffect(() => {
		if (isOpen && (dialogMode === 'edit' || dialogMode === 'create')) {
			setTimeout(() => setFocus('title'), 100);
		}
	}, [isOpen, dialogMode, setFocus]);

	const openDialog = (mode: 'create' | 'edit' | 'delete', id?: string) => {
		setDialogMode(mode);
		setCurrentId(id || null);
		if (mode === 'edit' && id) {
			const t = tasks.find((t) => t.id === id);
			if (t) reset({ title: t.title, description: t.description });
		} else if (mode === 'create') {
			reset({ title: '', description: '' });
		}
		setIsOpen(true);
	};

	const closeDialog = () => setIsOpen(false);

	const onSubmit = async (data: FormData) => {
		if (dialogMode === 'edit' && currentId)
			await updateTask(currentId, data);
		if (dialogMode === 'create') await createTask(data);
		closeDialog();
	};

	const confirmDelete = () => {
		if (currentId) deleteTask(currentId);
		closeDialog();
	};

	const ordered = order
		.map((id) => tasks.find((t) => t.id === id))
		.filter(Boolean) as typeof tasks;

	return (
		<div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
			<h1 className="text-2xl font-semibold text-center mb-6">
				Gestor de Tareas
			</h1>
			{error && (
				<div className="p-2 mb-4 bg-red-50 text-red-700 rounded-md">
					Error: {error}
				</div>
			)}
			<Button onClick={() => openDialog('create')}>Nueva Tarea</Button>
			{loadingFetch ? (
				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<TaskSortableSkeleton key={i} />
					))}
				</div>
			) : !ordered.length ? (
				<p className="text-center text-gray-500">No hay tareas.</p>
			) : (
				<TaskList
					ordered={ordered}
					order={order}
					setOrder={setOrder}
					openDialog={openDialog}
				/>
			)}
			<TaskDialogRouter
				isOpen={isOpen}
				closeDialog={closeDialog}
				dialogMode={dialogMode}
				errors={errors}
				register={register}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				confirmDelete={confirmDelete}
			/>
		</div>
	);
}
