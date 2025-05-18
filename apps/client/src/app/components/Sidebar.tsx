import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/user.store';
import { Permission } from '../../types/permission.enum';
import { useAuth } from '../hooks/useAuth'; // Importar el hook useAuth

// Define navigation items with required permissions
interface NavItem {
	path: string;
	label: string;
	icon: string;
	requiredPermission?: Permission;
}

const navItems: NavItem[] = [
	{
		path: '/dashboard',
		label: 'Dashboard',
		icon: '📊',
	},
	{
		path: '/tasks',
		label: 'My Tasks',
		icon: '📝',
		requiredPermission: Permission.TASK_READ_OWN_LIST,
	},
	{
		path: '/admin/tasks',
		label: 'All Tasks',
		icon: '📋',
		requiredPermission: Permission.TASK_READ_ANY_LIST,
	},
	{
		path: '/settings',
		label: 'Settings',
		icon: '⚙️',
		requiredPermission: Permission.SETTINGS_VIEW,
	},
	{
		path: '/admin/users',
		label: 'User Management',
		icon: '👥',
		requiredPermission: Permission.USER_READ_ALL,
	},
];

const Sidebar: React.FC = () => {
	const { user } = useUserStore();
	const { logout } = useAuth(); // Usar el hook useAuth
	const navigate = useNavigate();

	if (!user || !user.permissions) {
		return null;
	}

	const filteredNavItems = navItems.filter(
		(item) =>
			!item.requiredPermission ||
			user.permissions?.includes(item.requiredPermission)
	);

	const handleLogout = () => {
		logout(); // Llamar a la funci&#243;n logout del hook useAuth
		navigate('/auth/logout'); // Navegar a la ruta de logout
	};

	return (
		<aside className="w-64 bg-gray-800 text-white h-screen p-4">
			<div className="mb-6">
				<h2 className="text-xl font-bold">App Name</h2>
				<p className="text-gray-400 text-sm">{user.name}</p>
			</div>

			<nav>
				<ul className="space-y-2">
					{filteredNavItems.map((item) => (
						<li key={item.path}>
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
										isActive ? 'bg-gray-700' : ''
									}`
								}
							>
								<span className="mr-3">{item.icon}</span>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className="absolute bottom-4 w-52">
				<button
					onClick={handleLogout}
					className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors w-full"
				>
					<span className="mr-3">🚪</span>
					Logout
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;