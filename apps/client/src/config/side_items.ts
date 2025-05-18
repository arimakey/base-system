import { SideItem } from '../types/menu.interface';
import { Permission } from '../types/permission.enum';

const sideItems: SideItem[] = [
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

export default sideItems;
