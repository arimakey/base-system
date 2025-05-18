import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStore } from '../../stores/task.store';
import { TaskList } from './records/task.list';
import { TaskSortableSkeleton } from './records/task.skeleton';
import { Button } from '../components/Button';
import { TaskDialogRouter } from './dialogs/task.dialog';
import SearchBar from '../components/SearchBar';
import { useUserStore } from '../../stores/user.store';
import { Permission } from '../../types/permission.enum';

const schema = z.object({
	title: z.string().min(1, 'Título es obligatorio'),
	description: z.string().min(1, 'Descripción es obligatoria'),
});
type FormData = z.infer<typeof schema>;

interface TasksPageProps {
  isAdmin?: boolean;
}

export default function TasksPage({ isAdmin = false }: TasksPageProps) {
	const { user } = useUserStore();
	const {
		tasks,
		filteredTasks,
		fetchTasks,
		fetchAdminTasks,
		createTask,
		updateTask,
		deleteTask,
		updateAdminTask,
		deleteAdminTask,
		loadingFetch,
		error,
		setSearchTerm,
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

	// Check if user has admin permissions
	const hasAdminPermission = user?.permissions?.includes(Permission.TASK_READ_ANY_LIST) || false;

	useEffect(() => {
		// Use the appropriate fetch method based on isAdmin and permissions
		if (isAdmin && hasAdminPermission) {
			fetchAdminTasks();
		} else {
			fetchTasks();
		}
	}, [fetchTasks, fetchAdminTasks, isAdmin, hasAdminPermission]);

	useEffect(() => setOrder(filteredTasks.map((t) => t.id)), [filteredTasks]);
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
		if (dialogMode === 'edit' && currentId) {
			if (isAdmin && hasAdminPermission) {
				await updateAdminTask(currentId, data);
			} else {
				await updateTask(currentId, data);
			}
		}
		if (dialogMode === 'create') {
			await createTask({
				title: data.title,
				description: data.description,
			});
		}
		closeDialog();
	};

	const confirmDelete = () => {
		if (currentId) {
			if (isAdmin && hasAdminPermission) {
				deleteAdminTask(currentId);
			} else {
				deleteTask(currentId);
			}
		}
		closeDialog();
	};

	// Ordenar las tareas filtradas según el orden establecido
	const ordered = order
		.map((id) => filteredTasks.find((t) => t.id === id))
		.filter(Boolean) as typeof tasks;

	// Check user's permissions for displaying buttons
	const canCreate = user?.permissions?.includes(Permission.TASK_CREATE);
	const canEdit = isAdmin
	  ? user?.permissions?.includes(Permission.TASK_UPDATE_ANY)
	  : user?.permissions?.includes(Permission.TASK_UPDATE_OWN);
	const canDelete = isAdmin
	  ? user?.permissions?.includes(Permission.TASK_DELETE_ANY)
	  : user?.permissions?.includes(Permission.TASK_DELETE_OWN);

	return (
		<div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
			<h1 className="text-2xl font-semibold text-center mb-6">
				{isAdmin ? 'Administración de Tareas' : 'Mis Tareas'}
			</h1>
			{error && (
				<div className="p-2 mb-4 bg-red-50 text-red-700 rounded-md">
					Error: {error}
				</div>
			)}
			<div className="flex flex-col sm:flex-row gap-4 mb-4">
				<SearchBar
					onSearch={setSearchTerm}
					placeholder="Buscar por título o descripción..."
					className="flex-grow"
				/>
				{canCreate && (
				<Button onClick={() => openDialog('create')}>
					Nueva Tarea
				</Button>
			)}
		</div>
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
					canEdit={canEdit}
					canDelete={canDelete}
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

