import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FiEdit, FiXCircle, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

interface TaskMenuProps {
	task: { id: string; completed: boolean }; // Replace with your actual Task type if available
	openDialog: (
		mode: 'create' | 'edit' | 'delete' | 'state',
		id?: string,
		options?: Record<string, unknown>
	) => void;
	canEdit?: boolean;
	canDelete?: boolean;
}

export function TaskMenu({
	task,
	openDialog,
	canEdit = true,
	canDelete = true,
}: TaskMenuProps) {
	return (
		<Menu as="div" className="relative">
			<MenuButton className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-500 transition-colors duration-150 hover:cursor-pointer">
				<HiOutlineDotsVertical className="w-5 h-5" />
			</MenuButton>

			<MenuItems
				transition
				anchor="bottom end"
				className="w-52 origin-top-right rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-lg focus:outline-none data-closed:scale-95 data-closed:opacity-0"
			>
				{canEdit && (
					<MenuItem>
						<button
							onClick={() => openDialog('edit', task.id)}
							className="group flex w-full items-center gap-2 rounded-md px-3 py-2 data-focus:bg-gray-100"
						>
							<FiEdit className="w-4 h-4 text-gray-500" />
							Editar
						</button>
					</MenuItem>
				)}

				<MenuItem>
					<button
						onClick={() =>
							openDialog('state', task.id, {
								completed: task.completed,
							})
						}
						className="group flex w-full items-center gap-2 rounded-md px-3 py-2 data-focus:bg-gray-100 text-left"
					>
						{task.completed ? (
							<>
								<FiXCircle className="h-4 text-gray-500" />
								Marcar como pendiente
							</>
						) : (
							<>
								<FiCheckCircle className="h-4 text-gray-500" />
								Marcar como completada
							</>
						)}
					</button>
				</MenuItem>

				{canDelete && (
					<>
						<div className="my-1 h-px bg-gray-200" />
						<MenuItem>
							<button
								onClick={() => openDialog('delete', task.id)}
								className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-red-600 data-focus:bg-red-50"
							>
								<FiTrash2 className="w-4 h-4" />
								Eliminar
							</button>
						</MenuItem>
					</>
				)}
			</MenuItems>
		</Menu>
	);
}
