import TaskForm from './task.form';
import TaskList from './task.list';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskStoreProvider } from '../../store/task.store';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TaskStoreProvider>
				<div className="max-w-xl mx-auto mt-10 space-y-6 p-4">
					<h1 className="text-2xl font-bold text-center">
						Task Manager
					</h1>
					<TaskForm />
					<div className="border-t pt-4">
						<h2 className="text-lg font-semibold mb-3">
							Mis Tareas
						</h2>
						<TaskList />
					</div>
				</div>
			</TaskStoreProvider>
		</QueryClientProvider>
	);
}
