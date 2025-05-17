import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, deleteTask } from '../../api/task.service';
import { useTaskStore } from '../../store/task.store';
import { Task } from '../../types/tasks.interface';

export default function TaskList() {
	const queryClient = useQueryClient();
	const { setSelectedTask } = useTaskStore();

	const { data: tasks = [], isLoading } = useQuery({
		queryKey: ['tasks'],
		queryFn: fetchTasks,
	});

	const deleteMutation = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
	});

	if (isLoading) return <p>Loading...</p>;

	return (
		<ul className="space-y-2">
			{tasks.length === 0 ? (
				<li className="text-center py-4">No hay tareas disponibles</li>
			) : (
				tasks.map((task: Task) => (
					<li
						key={task.id}
						className="border p-2 flex justify-between items-center rounded"
					>
						<div>
							<h3 className="font-bold">{task.title}</h3>
							<p className="text-sm text-gray-600">
								{task.description}
							</p>
							<span
								className={`inline-block px-2 py-1 rounded text-xs ${
									task.status === 'COMPLETED'
										? 'bg-green-100 text-green-800'
										: task.status === 'IN_PROGRESS'
										? 'bg-blue-100 text-blue-800'
										: 'bg-gray-100 text-gray-800'
								}`}
							>
								{task.status}
							</span>
						</div>
						<div className="space-x-2">
							<button
								onClick={() => setSelectedTask(task)}
								className="text-blue-500 hover:text-blue-700"
							>
								Edit
							</button>
							<button
								onClick={() => deleteMutation.mutate(task.id)}
								className="text-red-500 hover:text-red-700"
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending
									? 'Eliminando...'
									: 'Delete'}
							</button>
						</div>
					</li>
				))
			)}
		</ul>
	);
}
