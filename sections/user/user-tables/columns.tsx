'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Roles } from '@/constants/roles';

export const columns: ColumnDef<AdminRegisterUsers, UserRegister>[] = [
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => <span>{row.original.role === Roles.vip_user ? "VIP" : "User"}</span>
  },
  {
    accessorKey: 'tag',
    header: 'TAG NUMBER',
    cell: ({ row }) => <span>{row.original.tag}</span>
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => (
      <span>
        {row.original.firstname} {row.original.lastname}
      </span>
    )
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => <span>{row.original.email}</span>
  },
  {
    accessorKey: 'ip',
    header: 'SIGN UP IP',
    cell: ({ row }) => <span>{row.original.ip}</span>
  },
  {
    accessorKey: 'lastLoginIp',
    header: 'LAST IP',
    cell: ({ row }) => <span>{row.original.lastLoginIp}</span>
  },
  {
    accessorKey: 'phonenumber',
    header: 'PHONE NUMBER',
    cell: ({ row }) => (
      <span>
        {row.original &&
          row.original.phoneno
          ? row.original.phoneno
          : 'none'}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => <CellAction userId={row.original._id} />
  }
];
