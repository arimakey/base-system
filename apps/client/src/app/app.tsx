import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { routes } from './routes';

export function App() {
	return (
		<>
			<Toaster richColors />
			<Routes>
				{routes.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={route.element}
					/>
				))}
			</Routes>
		</>
	);
}

export default App;
