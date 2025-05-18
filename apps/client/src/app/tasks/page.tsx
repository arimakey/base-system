import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
} from '@tanstack/react-table';

import { useTaskStore } from '../../stores/task.store';
import { CreateTaskDto, Task } from '../../types/tasks.interface';

// SkeletonRow para mostrar mientras carga
function SkeletonRow() {
	return (
		<tr>
			<td className="px-4 py-2">
				<div className="h-4 w-24 skeleton"></div>
			</td>
			<td className="px-4 py-2">
				<div className="h-4 w-48 skeleton"></div>
			</td>
			<td className="px-4 py-2">
				<div className="h-6 w-20 skeleton inline-block"></div>
				<div className="h-6 w-20 skeleton inline-block ml-2"></div>
			</td>
		</tr>
	);
}

export default function TasksPage() {
	const {
		tasks,
		selectedTask,
		selectTask,
		fetchTasks,
		createTask,
		updateTask,
		deleteTask,
		loadingFetch,
		error,
	} = useTaskStore();

	const [sorting, setSorting] = useState<SortingState>([]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTaskDto>({
		defaultValues: { title: '', description: '' },
	});

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	useEffect(() => {
		if (selectedTask) {
			reset({
				title: selectedTask.title,
				description: selectedTask.description,
			});
		} else {
			reset({ title: '', description: '' });
		}
	}, [selectedTask, reset]);

	const onSubmit = handleSubmit(async (values) => {
		if (selectedTask) {
			await updateTask(selectedTask.id, values);
			selectTask(null);
		} else {
			await createTask(values);
			reset({ title: '', description: '' });
		}
	});

	const columns = React.useMemo<ColumnDef<Task>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				enableSorting: true,
			},
			{
				accessorKey: 'description',
				header: 'Description',
				enableSorting: true,
			},
			{
				id: 'actions',
				header: 'Actions',
				cell: ({ row }) => (
					<div className="space-x-2">
						<button
							onClick={() => selectTask(row.original)}
							className="px-2 py-1 rounded bg-blue-500 text-white"
						>
							Edit
						</button>
						<button
							onClick={() => deleteTask(row.original.id)}
							className="px-2 py-1 rounded bg-red-500 text-white"
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[selectTask, deleteTask]
	);

	const table = useReactTable({
		data: tasks,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Task Manager</h1>

			{error && (
				<div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
					Error: {error}
				</div>
			)}

			<form onSubmit={onSubmit} className="mb-6 space-y-4">
				<div>
					<label htmlFor="title" className="block mb-1 font-medium">
						Title
					</label>
					<input
						id="title"
						{...register('title', {
							required: 'Title is required',
						})}
						className="w-full border rounded p-2"
						aria-invalid={errors.title ? 'true' : 'false'}
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.title.message}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="description"
						className="block mb-1 font-medium"
					>
						Description
					</label>
					<textarea
						id="description"
						{...register('description', {
							required: 'Description is required',
						})}
						className="w-full border rounded p-2"
						aria-invalid={errors.description ? 'true' : 'false'}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm mt-1">
							{errors.description.message}
						</p>
					)}
				</div>
				<div className="flex items-center">
					<button
						type="submit"
						className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
					>
						{selectedTask ? 'Update Task' : 'Create Task'}
					</button>
					{selectedTask && (
						<button
							type="button"
							onClick={() => selectTask(null)}
							className="ml-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			{loadingFetch ? (
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className="border-b border-gray-300 bg-gray-100"
								>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-4 py-2 text-left font-semibold"
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{[...Array(5)].map((_, i) => (
								<SkeletonRow key={i} />
							))}
						</tbody>
					</table>
				</div>
			) : tasks.length === 0 ? (
				<div className="text-center p-4 border rounded bg-gray-50">
					<p className="text-gray-600">
						No tasks found. Create your first task above.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className="border-b border-gray-300 bg-gray-100"
								>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-4 py-2 text-left font-semibold"
											onClick={header.column.getToggleSortingHandler()}
											style={{
												cursor: header.column.getCanSort()
													? 'pointer'
													: 'default',
											}}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
											{header.column.getCanSort() && (
												<span className="ml-1">
													{{
														asc: ' 🔼',
														desc: ' 🔽',
													}[
														header.column.getIsSorted() as string
													] ?? ' ↕️'}
												</span>
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-gray-200 hover:bg-gray-50"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-2">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
