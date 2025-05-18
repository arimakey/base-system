import {
	DndContext,
	closestCenter,
	useSensor,
	useSensors,
	PointerSensor,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import { TaskSortableItem } from './task.item';

interface TaskListProps {
	ordered: any[];
	order: string[];
	setOrder: (order: string[]) => void;
	openDialog: (mode: 'create' | 'edit' | 'delete', id?: string) => void;
	canEdit?: boolean;
	canDelete?: boolean;
}

export function TaskList({
	ordered,
	order,
	setOrder,
	openDialog,
	canEdit = true,
	canDelete = true
}: TaskListProps) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	);

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = order.indexOf(active.id as string);
		const newIndex = order.indexOf(over.id as string);
		const newOrder = arrayMove(order, oldIndex, newIndex);
		setOrder(newOrder);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={onDragEnd}
		>
			<SortableContext
				items={order}
				strategy={verticalListSortingStrategy}
			>
				<div className="space-y-4">
					{ordered.map((task: any, i: number) => (
						<TaskSortableItem
							key={task.id}
							task={task}
							index={i}
							openDialog={openDialog}
							canEdit={canEdit}
							canDelete={canDelete}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

