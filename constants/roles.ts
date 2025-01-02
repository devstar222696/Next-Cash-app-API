export enum Roles {
    admin = 'sub_admin',
    super_admin = 'admin',
    user ='user',
    vip_user = 'vip_user',
}

export const AdminRoles: Array<Roles> = [
    Roles.admin,
    Roles.super_admin,
]

export const UserRoles: Array<Roles> = [
    Roles.user,
    Roles.vip_user
]

export type AccessRight = 'admin' | 'user';

export const RolesByAccessRight: Record<AccessRight, Array<Roles>> = {
    admin: AdminRoles,
    user: UserRoles
}