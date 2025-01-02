import { Roles } from "./roles"

export enum PermissionsMap {
    multi_select = 'multi_select',
    multi_accept = 'multi_accept',
    multi_decline = 'multi_decline',
    multi_restore = 'multi_restore',
    multi_delete = 'multi_delete',
    delete = 'delete',
}
export const PermissionsByRole: Partial<Record<Roles, Array<PermissionsMap>>> = {
    [Roles.admin]: [],
    [Roles.super_admin]: [
        PermissionsMap.multi_select,
        PermissionsMap.multi_accept,
        PermissionsMap.multi_decline,
        PermissionsMap.multi_restore,
        PermissionsMap.multi_delete,
        PermissionsMap.delete,
    ],
}