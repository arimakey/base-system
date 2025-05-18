import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	HiOutlineClock,
	HiOutlineCalendar,
	HiOutlineTag,
	HiViewGrid,
} from 'react-icons/hi';
import { getPriorityColor } from '../../../utils/priority';
import { getDueStatus } from '../../../utils/dates';
import { TaskMenu } from './task.menu';

export function TaskSortableItem({ task, openDialog }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.6 : 1,
	};

	const dueStatus = getDueStatus(task.dueDate);
	const priorityClass = getPriorityColor(task.priority);
	const completedClass = task.completed ? 'border-l-4 border-green-500' : '';

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className={`flex rounded-lg bg-white border border-gray-200 mb-3 ${completedClass}`}
		>
			<div
				{...listeners}
				className="cursor-grab w-10 flex items-center justify-center bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
				aria-label="Drag handle"
			>
				<HiViewGrid className="w-5 h-5" />
			</div>

			<div className="flex flex-1 p-4">
				<div className="flex-1">
					<div className="flex items-center flex-wrap gap-2 mb-1">
						<h3 className="font-medium text-gray-900">
							{task.title}
						</h3>

						{task.priority && (
							<span
								className={`text-xs px-2 py-0.5 rounded-full ${priorityClass}`}
							>
								{task.priority}
							</span>
						)}

						{task.completed && (
							<span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
								Completada
							</span>
						)}
					</div>

					{task.description && (
						<p className="text-gray-600 text-sm mt-1">
							{task.description}
						</p>
					)}

					<div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
						<div className="flex items-center">
							<HiOutlineCalendar className="w-4 h-4 mr-1" />
							<span>
								Creada:{' '}
								{new Date(task.createdAt).toLocaleDateString()}
							</span>
						</div>

						{task.dueDate && (
							<div className="flex items-center">
								<HiOutlineClock className="w-4 h-4 mr-1" />
								<span className={dueStatus?.class || ''}>
									{dueStatus?.text}
								</span>
							</div>
						)}

						{task.tags && task.tags.length > 0 && (
							<div className="flex items-center">
								<HiOutlineTag className="w-4 h-4 mr-1" />
								<span>{task.tags.join(', ')}</span>
							</div>
						)}
					</div>
				</div>

				<TaskMenu task={task} openDialog={openDialog} />
			</div>
		</div>
	);
}
