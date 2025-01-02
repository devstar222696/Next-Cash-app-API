'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CodeAction } from './code-number';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import useSocket from '@/lib/socket';
import { LoginIdAction } from './login-id';
import { PermissionsMap } from '@/constants/permissions';

const { socket } = useSocket();

export const columns: ColumnDef<UserRegister & AdminRegisterUsers>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
          setTimeout(() => {
            if (value) {
              const selectedRows = table
                .getRowModel()
                .rows.filter((row) => row.getIsSelected());
              const idsAndDates = selectedRows.map((row) => ({
                id: row.original.user?._id,
                date: row.original.date
              }));
              socket?.emit('selectRegisterAllIds', idsAndDates);
            } else {
              socket?.emit('selectRegisterAllIds', '');
            }
          }, 0);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          if (value) {
            const idsAndDate = {
              id: row.original.user?._id,
              date: row.original.date
            };
            socket?.emit('selectRegisterIds', idsAndDate);
          } else {
            const deleteId = {
              date: row.original.date
            };
            socket?.emit('selectRegisterIds', deleteId);
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      requiredPermissions: [PermissionsMap.multi_select]
    },
  },
  // {
  //   accessorKey: 'tag',
  //   header: 'TAG NUMBER',
  //   cell: ({ row }) => <span>{row.original.user.tag || 'none'}</span>
  // },
  {
    accessorKey: 'nickname',
    header: 'NICKNAME'
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => (
      <span>
        {row.original.user.firstname} {row.original.user.lastname}
      </span>
    )
  },
  {
    accessorKey: 'phonenumber',
    header: 'PHONE NUMBER',
    cell: ({ row }) => <span>{row.original.user.phoneno}</span>
  },
  {
    accessorKey: 'ip',
    header: 'IP ADDRESS',
    cell: ({ row }) => <span>{row.original.user.ip}</span>
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
      id: 'login-password',
      header: 'LOGIN ID AND PASSWORD CODE',
      cell: ({ row,table }) => {
        return(
          <LoginIdAction
          rowId={row.id}
          dateV={row.original.date}
          loginIdV={row.original.loginid}
          passwordCodeV={row.original.passwordcode}
          userName={row.original.user._id}
        />
        )
      }
    },
  // {
  //   id: 'code-number',
  //   header: 'CODE NUMBER',
  //   cell: ({ row }) => (
  //     <CodeAction
  //       rowId={row.id}
  //       registerDate={row.original.date}
  //       codeNumber={row.original.codenumber}
  //       regiStatus={row.original.status}
  //       userName={row.original.user._id}
  //     />
  //   )
  // },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
      rowId={row.id}
      registerDate={row.original.date}
        userId={row.original.user._id}
      />
    )
  }
];
