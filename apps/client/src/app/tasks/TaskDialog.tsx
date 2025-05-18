import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Description,
	Button,
} from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function TaskDialog({
	isOpen,
	closeDialog,
	dialogMode,
	errors,
	register,
	handleSubmit,
	onSubmit,
	confirmDelete,
}: any) {
	return (
		<Dialog
			open={isOpen}
			as="div"
			className="relative z-10 focus:outline-none"
			onClose={closeDialog}
		>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
					>
						{dialogMode === 'delete' ? (
							<>
								<DialogTitle
									as="h3"
									className="text-lg font-medium"
								>
									Confirmar eliminación
								</DialogTitle>
								<Description>
									¿Seguro quieres eliminar esta tarea?
								</Description>
								<div className="flex justify-end gap-3 mt-4">
									<Button
										onClick={closeDialog}
										className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
									>
										Cancelar
									</Button>
									<Button
										onClick={confirmDelete}
										className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
									>
										Eliminar
									</Button>
								</div>
							</>
						) : (
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<DialogTitle
									as="h3"
									className="text-lg font-medium"
								>
									{dialogMode === 'create'
										? 'Nueva tarea'
										: 'Editar tarea'}
								</DialogTitle>
								<Description>
									{dialogMode === 'create'
										? 'Completa los campos para crear una nueva tarea'
										: 'Modifica los campos para editar la tarea'}
								</Description>
								<div>
									<label
										htmlFor="title"
										className="block text-sm font-medium"
									>
										Título
									</label>
									<input
										id="title"
										{...register('title')}
										className="w-full border px-3 py-2 rounded-md mt-1"
									/>
									{errors.title && (
										<p className="text-sm text-red-500 mt-1">
											{errors.title.message}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="description"
										className="block text-sm font-medium"
									>
										Descripción
									</label>
									<textarea
										id="description"
										{...register('description')}
										className="w-full border px-3 py-2 rounded-md mt-1"
										rows={3}
									/>
									{errors.description && (
										<p className="text-sm text-red-500 mt-1">
											{errors.description.message}
										</p>
									)}
								</div>
								<div className="flex justify-end gap-3">
									<Button
										type="button"
										onClick={closeDialog}
										className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
									>
										Cancelar
									</Button>
									<Button
										type="submit"
										className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
									>
										{dialogMode === 'create'
											? 'Crear'
											: 'Guardar'}
									</Button>
								</div>
							</form>
						)}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
