import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Description,
} from '@headlessui/react';
import { Button } from '../../components/Button';


export function DeleteTaskDialog({ isOpen, closeDialog, confirmDelete }: any) {
	return (
		<Dialog
			open={isOpen}
			as="div"
			className="relative z-10"
			onClose={closeDialog}
		>
			<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
				<DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
					<DialogTitle as="h3" className="text-lg font-medium">
						Confirmar eliminación
					</DialogTitle>
					<Description>
						¿Seguro quieres eliminar esta tarea?
					</Description>

					<div className="flex justify-end gap-3 mt-4">
						<Button onClick={closeDialog} variant="secondary">
							Cancelar
						</Button>
						<Button
							onClick={confirmDelete}
							variant="primary"
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							Eliminar
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
