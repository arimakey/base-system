import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Description,
} from '@headlessui/react';
import Input from '../../components/Input';
import { Button } from '../../components/Button';

export function EditTaskDialog({
	isOpen,
	closeDialog,
	dialogMode,
	errors,
	register,
	handleSubmit,
	onSubmit,
}: any) {
	const isCreate = dialogMode === 'create';

	return (
		<Dialog
			open={isOpen}
			as="div"
			className="relative z-10"
			onClose={closeDialog}
		>
			<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
				<DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<DialogTitle as="h3" className="text-lg font-medium">
							{isCreate ? 'Nueva tarea' : 'Editar tarea'}
						</DialogTitle>
						<Description>
							{isCreate
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
							<Input
								id="title"
								register={register}
								variant="primary"
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
							<Input
								id="description"
								register={register}
								variant="primary"
								as="textarea"
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
								variant="secondary"
							>
								Cancelar
							</Button>
							<Button type="submit" variant="primary">
								{isCreate ? 'Crear' : 'Guardar'}
							</Button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
