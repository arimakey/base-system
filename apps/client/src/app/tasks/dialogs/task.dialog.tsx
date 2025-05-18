import { DeleteTaskDialog } from './task.delete.dialog';
import { EditTaskDialog } from './task.edit.dialog';
import { ChangeStateDialog } from './task.update.dialog';

export function TaskDialogRouter(props: any) {
	const { dialogMode } = props;

	if (dialogMode === 'delete') return <DeleteTaskDialog {...props} />;
	if (dialogMode === 'state') return <ChangeStateDialog {...props} />;
	if (dialogMode === 'create' || dialogMode === 'edit')
		return <EditTaskDialog {...props} />;

	return null;
}
