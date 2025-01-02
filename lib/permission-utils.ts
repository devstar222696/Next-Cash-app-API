import { PermissionsByRole, PermissionsMap } from "@/constants/permissions";
import { Roles } from "@/constants/roles";

export const hasPermissionForRole = (role: Roles, requiredPermissions: Array<PermissionsMap>) => {
    return requiredPermissions.every(requiredPermission => PermissionsByRole[role]?.includes(requiredPermission));
}

export const filterColumnsByPermissions = (role: Roles, columns: Array<any>): Array<any> => {
    return columns.filter(column => {
        if (!column.meta?.requiredPermissions) {
            return true;
        }

        return hasPermissionForRole(role, column.meta.requiredPermissions);
    });
}