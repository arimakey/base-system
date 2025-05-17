import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../../api/task.service';
import { useTaskStore } from '../../store/task.store';
import { CreateTaskDto, TaskStatus, Task } from '../../types/tasks.interface';
import { useEffect } from 'react';

function getFormDefaultValues(selectedTask: Task | null): CreateTaskDto {
	return {
		title: selectedTask?.title || '',
		description: selectedTask?.description || '',
		status: selectedTask?.status || TaskStatus.PENDING,
	};
}

export default function TaskForm() {
	const { selectedTask, setSelectedTask } = useTaskStore();
	const queryClient = useQueryClient();

	const form = useForm<CreateTaskDto>({
		defaultValues: getFormDefaultValues(selectedTask),
		onSubmit: async ({ value }) => {
			if (selectedTask) {
				await updateMutation.mutateAsync({
					id: selectedTask.id,
					...value,
				});
			} else {
				await createMutation.mutateAsync(value);
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			form.reset();
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			form.reset();
			setSelectedTask(null);
		},
	});

	useEffect(() => {
		form.reset(getFormDefaultValues(selectedTask));
	}, [selectedTask]);

	return (
		<div className="max-w-md mx-auto">
			<h2 className="text-xl font-semibold mb-4">
				{selectedTask ? 'Editar Tarea' : 'Crear Tarea'}
			</h2>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				{/* Campo Título */}
				<form.Field
					name="title"
					children={(field) => (
						<div>
							<input
								id={field.name}
								value={field.state.value}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								onBlur={field.handleBlur}
								placeholder="Título"
								className="border p-2 w-full rounded"
							/>
							{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 && (
									<p className="text-red-500 text-sm mt-1">
										{field.state.meta.errors.join(', ')}
									</p>
								)}
						</div>
					)}
				/>

				{/* Campo Descripción */}
				<form.Field
					name="description"
					children={(field) => (
						<div>
							<textarea
								id={field.name}
								value={field.state.value}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								onBlur={field.handleBlur}
								placeholder="Descripción"
								className="border p-2 w-full rounded"
								rows={4}
							/>
						</div>
					)}
				/>

				{/* Select de Estado */}
				<form.Field
					name="status"
					children={(field) => (
						<div>
							<select
								id={field.name}
								value={field.state.value}
								onChange={(e) =>
									field.handleChange(
										e.target.value as TaskStatus
									)
								}
								onBlur={field.handleBlur}
								className="border p-2 w-full rounded"
							>
								<option value={TaskStatus.PENDING}>
									Pending
								</option>
								<option value={TaskStatus.IN_PROGRESS}>
									In Progress
								</option>
								<option value={TaskStatus.COMPLETED}>
									Completed
								</option>
							</select>
						</div>
					)}
				/>

				{/* Botones */}
				<div className="flex space-x-2 items-center">
					<form.Subscribe
						selector={(s) => [s.canSubmit, s.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<button
								type="submit"
								disabled={!canSubmit}
								className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
							>
								{isSubmitting
									? 'Guardando...'
									: selectedTask
									? 'Actualizar'
									: 'Crear'}
							</button>
						)}
					/>

					{selectedTask && (
						<button
							type="button"
							onClick={() => {
								setSelectedTask(null);
								form.reset(getFormDefaultValues(null));
							}}
							className="bg-gray-300 text-black px-4 py-2 rounded"
						>
							Cancelar
						</button>
					)}
				</div>
			</form>
		</div>
	);
}
