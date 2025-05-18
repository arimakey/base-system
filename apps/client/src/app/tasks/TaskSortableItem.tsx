import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { HiOutlineDotsVertical, HiOutlineMenu } from 'react-icons/hi';

export function TaskSortableItem({ task, index, openDialog }: any) {
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

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="p-4 rounded-md bg-white shadow-sm mb-2"
		>
			<div className="flex items-start">
				<div
					{...listeners}
					className="cursor-grab mr-3"
					aria-label="Drag handle"
				>
					<HiOutlineMenu className="w-5 h-5 text-gray-400" />
				</div>
				<div className="flex-1">
					<h3 className="font-medium">{task.title}</h3>
					<p className="text-gray-600 text-sm mt-1">
						{task.description}
					</p>
				</div>
				<Menu>
					<MenuButton className="p-1 hover:bg-gray-100 rounded-full transition hover:cursor-pointer">
						<HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
					</MenuButton>
					<MenuItems
						anchor="bottom"
						className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg"
					>
						<MenuItem>
							<button
								onClick={() => openDialog('edit', task.id)}
								className="w-full text-left px-4 py-2 hover:bg-gray-100"
							>
								Editar
							</button>
						</MenuItem>
						<MenuItem>
							<button
								onClick={() => openDialog('delete', task.id)}
								className="w-full text-left px-4 py-2 hover:bg-gray-100"
							>
								Eliminar
							</button>
						</MenuItem>
					</MenuItems>
				</Menu>
			</div>
			<p className="text-xs text-gray-400 mt-2">
				Creada: {new Date(task.createdAt).toLocaleDateString()}
			</p>
		</div>
	);
}
