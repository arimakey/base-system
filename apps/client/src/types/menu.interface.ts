import { Permission } from "./permission.enum";

export interface SideItem {
	path: string;
	label: string;
	icon: string;
	requiredPermission?: Permission;
}
