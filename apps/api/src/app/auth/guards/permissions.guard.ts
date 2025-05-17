import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { rolePermissions } from '../role-permissions.config';
import { User } from '../../types/user';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required, access granted
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (!user || !user.roles || user.roles.length === 0) {
      return false; // No user or no roles assigned to user
    }

    const userPermissions = user.roles.reduce((acc, role) => {
      const permissionsForRole = rolePermissions[role] || [];
      return [...new Set([...acc, ...permissionsForRole])]; // Use Set to avoid duplicates
    }, [] as Permission[]);

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
