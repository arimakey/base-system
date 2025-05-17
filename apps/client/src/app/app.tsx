// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';

export function App() {
	return (
		<Routes>
			{routes.map((route) => (
				<Route key={route.path} path={route.path} element={route.element} />
			))}
		</Routes>
	);
}

export default App;
