import LoginPage from '../auth/login/page';
import RegisterPage from '../auth/register/page';
import CallbackPage from '../auth/callback/page';
import LandingPage from '../landing/index/page';
import UserConfigPage from '../config/page';
import TasksPage from '../tasks/page';
import AuthGuard from '../components/AuthGuard';
import DashboardLayout from '../components/DashboardLayout';

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
		path: '/settings',
		element: (
			<AuthGuard>
				<DashboardLayout>
					<UserConfigPage />
				</DashboardLayout>
			</AuthGuard>
		),
	},
	{
		path: '/dashboard',
		element: (
			<AuthGuard>
				<DashboardLayout>
					<TasksPage />
				</DashboardLayout>
			</AuthGuard>
		),
	},
	{
		path: '/tasks',
		element: (
			<AuthGuard>
				<DashboardLayout>
					<TasksPage />
				</DashboardLayout>
			</AuthGuard>
		),
	},
	{
		path: '/admin/tasks',
		element: (
			<AuthGuard>
				<DashboardLayout>
					<TasksPage isAdmin={true} />
				</DashboardLayout>
			</AuthGuard>
		),
	},
	{
		path: '/auth/login/callback',
		element: <CallbackPage />,
	},
	{
		path: '/auth/logout',
		element: (
			<AuthGuard>
				<div>Logging out...</div>
			</AuthGuard>
		),
	},
];
