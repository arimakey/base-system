import LoginPage from '../auth/login/page';
import RegisterPage from '../auth/register/page';
import CallbackPage from '../auth/callback/page';
import LandingPage from '../landing/index/page';
import UserConfigPage from '../config/page';
import TasksPage from '../tasks/page';
import AuthGuard from '../components/AuthGuard';

interface RouteConfig {
	path: string;
	element: React.ReactNode;
}

export const routes: RouteConfig[] = [
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: '/auth/login',
		element: <LoginPage />,
	},
	{
		path: '/auth/register',
		element: <RegisterPage />,
	},
	{
		path: '/config',
		element: <AuthGuard>
			<UserConfigPage />
		</AuthGuard>,
	},
    {
        path: '/dashboard',
        element: <AuthGuard>
			<TasksPage />
		</AuthGuard>,
    },
	{
		path: '/auth/login/callback',
		element: <CallbackPage />,
	},
];
