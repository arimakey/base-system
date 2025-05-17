import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useTaskStore } from '../../store/task.store';
import { CreateTaskDto, TaskStatus, Task } from '../../types/tasks.interface';
import { createTask, updateTask } from '../../api/task.service';

// Zod schema for form validation
const taskSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'El título es obligatorio' })
		.max(100, { message: 'Máximo 100 caracteres' }),
	description: z.string().optional(),
	status: z.nativeEnum(TaskStatus),
});

type TaskFormValues = z.infer<typeof taskSchema>;

function getFormDefaultValues(selectedTask: Task | null): TaskFormValues {
	return {
		title: selectedTask?.title || '',
		description: selectedTask?.description || '',
		status: selectedTask?.status || TaskStatus.PENDING,
	};
}

export default function TaskForm() {
	const { selectedTask, setSelectedTask } = useTaskStore();

	const [formValues, setFormValues] = useState<TaskFormValues>(
		getFormDefaultValues(selectedTask)
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setFormValues(getFormDefaultValues(selectedTask));
	}, [selectedTask]);

	const validateForm = (values: TaskFormValues) => {
		const result = taskSchema.safeParse(values);
		if (!result.success) {
			const validationErrors: Record<string, string> = {};
			result.error.errors.forEach((error) => {
				if (error.path[0]) {
					validationErrors[error.path[0]] = error.message;
				}
			});
			return validationErrors;
		}
		return {};
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors = validateForm(formValues);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setErrors({});
		setIsSubmitting(true);

		try {
			if (selectedTask) {
				await updateTask({ id: selectedTask.id, data: formValues });
			} else {
				await createTask(formValues as CreateTaskDto);
			}
			setFormValues(getFormDefaultValues(null));
			if (selectedTask) setSelectedTask(null);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-md mx-auto">
			<h2 className="text-xl font-semibold mb-4">
				{selectedTask ? 'Editar Tarea' : 'Crear Tarea'}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Campo Título */}
				<div>
					<input
						name="title"
						value={formValues.title}
						onChange={handleChange}
						placeholder="Título"
						className="border p-2 w-full rounded"
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.title}
						</p>
					)}
				</div>

				{/* Campo Descripción */}
				<div>
					<textarea
						name="description"
						value={formValues.description}
						onChange={handleChange}
						placeholder="Descripción"
						className="border p-2 w-full rounded"
						rows={4}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm mt-1">
							{errors.description}
						</p>
					)}
				</div>

				{/* Select de Estado */}
				<div>
					<select
						name="status"
						value={formValues.status}
						onChange={handleChange}
						className="border p-2 w-full rounded"
					>
						<option value={TaskStatus.PENDING}>Pending</option>
						<option value={TaskStatus.IN_PROGRESS}>
							In Progress
						</option>
						<option value={TaskStatus.COMPLETED}>Completed</option>
					</select>
					{errors.status && (
						<p className="text-red-500 text-sm mt-1">
							{errors.status}
						</p>
					)}
				</div>

				{/* Botones */}
				<div className="flex space-x-2 items-center">
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
					>
						{isSubmitting
							? 'Guardando...'
							: selectedTask
							? 'Actualizar'
							: 'Crear'}
					</button>

					{selectedTask && (
						<button
							type="button"
							onClick={() => {
								setSelectedTask(null);
								setFormValues(getFormDefaultValues(null));
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
