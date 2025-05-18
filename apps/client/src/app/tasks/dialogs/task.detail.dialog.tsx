import {
	HiOutlineCalendar,
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineTag,
	HiOutlineUser,
} from 'react-icons/hi';
import { Button } from '../../components/Button';

export function ViewTaskDialog({
	task,
	closeDialog,
}: {
	task: any;
	closeDialog: () => void;
}) {
	if (!task) {
		return (
			<>
				<Dialog.Title className="text-lg font-medium text-gray-900">
					Detalles de Tarea
				</Dialog.Title>
				<div className="mt-4">
					<p className="text-sm text-gray-500">
						No se pudo cargar la información de la tarea.
					</p>
				</div>
				<div className="flex justify-end mt-6">
					<Button type="button" onClick={closeDialog}>
						Cerrar
					</Button>
				</div>
			</>
		);
	}

	const formattedDate = task.createdAt
		? new Date(task.createdAt).toLocaleDateString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
		  })
		: 'No disponible';

	const updatedDate = task.updatedAt
		? new Date(task.updatedAt).toLocaleDateString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
		  })
		: 'No disponible';

	// Calculate the due status if applicable
	const dueStatus = task.dueDate ? getDueStatus(task.dueDate) : null;
	const priorityClass = task.priority ? getPriorityColor(task.priority) : '';

	return (
		<>
			<Dialog.Title className="text-xl font-medium text-gray-900 pb-2 border-b mb-4">
				{task.title}
			</Dialog.Title>

			<div className="space-y-4">
				{/* Status and Priority */}
				<div className="flex flex-wrap gap-2">
					{task.completed && (
						<span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
							Completada
						</span>
					)}

					{!task.completed && (
						<span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
							Pendiente
						</span>
					)}

					{task.priority && (
						<span
							className={`text-xs px-2 py-1 rounded-full ${priorityClass} font-medium`}
						>
							{task.priority}
						</span>
					)}
				</div>

				{/* Description */}
				{task.description && (
					<div>
						<h3 className="text-sm font-medium text-gray-700 mb-1">
							Descripción
						</h3>
						<p className="text-gray-600 text-sm whitespace-pre-wrap">
							{task.description}
						</p>
					</div>
				)}

				{/* Dates */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
					<div className="flex items-center">
						<HiOutlineCalendar className="w-5 h-5 mr-2 text-gray-400" />
						<div>
							<div className="font-medium text-gray-700">
								Fecha de creación
							</div>
							<div className="text-gray-600">{formattedDate}</div>
						</div>
					</div>

					{task.updatedAt && task.updatedAt !== task.createdAt && (
						<div className="flex items-center">
							<HiOutlineCalendar className="w-5 h-5 mr-2 text-gray-400" />
							<div>
								<div className="font-medium text-gray-700">
									Última actualización
								</div>
								<div className="text-gray-600">
									{updatedDate}
								</div>
							</div>
						</div>
					)}

					{task.dueDate && (
						<div className="flex items-center">
							<HiOutlineClock className="w-5 h-5 mr-2 text-gray-400" />
							<div>
								<div className="font-medium text-gray-700">
									Fecha límite
								</div>
								<div className={dueStatus?.class || ''}>
									{dueStatus?.text}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Tags */}
				{task.tags && task.tags.length > 0 && (
					<div className="flex items-center text-sm">
						<HiOutlineTag className="w-5 h-5 mr-2 text-gray-400" />
						<div>
							<div className="font-medium text-gray-700">
								Etiquetas
							</div>
							<div className="flex flex-wrap gap-1 mt-1">
								{task.tags.map((tag: string, index: number) => (
									<span
										key={index}
										className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Assignment */}
				{task.assignedTo && (
					<div className="flex items-center text-sm">
						<HiOutlineUser className="w-5 h-5 mr-2 text-gray-400" />
						<div>
							<div className="font-medium text-gray-700">
								Asignado a
							</div>
							<div className="text-gray-600">
								{task.assignedTo}
							</div>
						</div>
					</div>
				)}

				{/* Completion Status */}
				{task.completed && (
					<div className="flex items-center text-sm">
						<HiOutlineCheckCircle className="w-5 h-5 mr-2 text-green-500" />
						<div>
							<div className="font-medium text-gray-700">
								Estado
							</div>
							<div className="text-green-600">Completada</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex justify-end mt-6">
				<Button type="button" onClick={closeDialog}>
					Cerrar
				</Button>
			</div>
		</>
	);
}
