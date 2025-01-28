'use client';
import { AdminRegisterUsers, Paymentredeems } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CheckboxDaily } from './checkboxdaily';
import { CheckboxBonus } from './checkboxbonus';
import { Checkbox } from '@/components/ui/checkbox';
import useSocket from '@/lib/socket';
import { PermissionsMap } from '@/constants/permissions';
import { Roles } from '@/constants/roles';

const { socket } = useSocket();

export const columns: ColumnDef<AdminRegisterUsers & Paymentredeems>[] = [
  {
    id: 'select',
    meta: {
      requiredPermissions: [PermissionsMap.multi_select]
    },
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
              socket?.emit('selectHistoryAllIds', idsAndDates);
            } else {
              socket?.emit('selectHistoryAllIds', '');
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
            socket?.emit('selectHistoryIds', idsAndDate);
          } else {
            const deleteId = {
              date: row.original.date
            };
            socket?.emit('selectHistoryIds', deleteId);
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => <span>{row.original.user.role === Roles.vip_user ? "VIP" : "User"}</span>
  },
  {
    accessorKey: 'id',
    header: 'TAG NUMBER',
    cell: ({ row }) => (
      <span
        onClick={() => {
          const tagNumber = row.original.user.tag;
          window.open(`/main/redeemhistory?tag=${tagNumber}`, '_blank');
        }}
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
      >
        {row.original.user.tag}
      </span>
    )
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
    accessorKey: 'paymentoption',
    header: 'GAME'
  },
  {
    accessorKey: 'user.loginid',
    header: 'GAME ID',
    cell: ({ row }) => {
      const paymentType = row.original.paymentoption;

      const registers = row.original.user?.register ?? [];

      const filtered = registers.filter((r: { category: string; }) => r.category === paymentType);

      const lastRegister = filtered[filtered.length - 1];

      return lastRegister?.loginid || 'none';
    },
  },
  {
    accessorKey: 'paymenttype',
    header: 'TYPE'
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    id: 'isMatchBonus',
    header: 'MATCH',
    cell: ({ row }) => {
      return <input type='checkbox' checked={row.original.isMatchBonus} className="h-4 w-4 rounded" disabled />;
    }
  },
  {
    id: 'isVipFreeplay',
    header: 'VIP',
    cell: ({ row }) => {
      return <input type='checkbox' checked={row.original.isVipFreeplay} className="h-4 w-4 rounded" disabled />;
    }
  },
  {
    id: 'daily',
    header: 'Daily',
    cell: ({ row }) => (
      <CheckboxDaily checkedStatus={row.original.dailyChecked} />
    )
  },
  {
    id: 'promo',
    header: 'Promo',
    cell: ({ row }) => (
      <input type='checkbox' checked={row.original.user.promoBonus} className="h-4 w-4 rounded" disabled />
    )
  },
  {
    id: 'bonus',
    header: 'BONUS',
    cell: ({ row }) => (
      <CheckboxBonus checkedStatus={row.original.bonusChecked} />
    )
  },
  {
    accessorKey: 'date',
    header: 'REQUEST TIME',
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  },
  {
    accessorKey: 'comdate',
    header: 'COMPLETE TIME',
    cell: ({ row }) => {
      const date = new Date(row.original.comdate);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  },
  {
    accessorKey: 'paymentstatus',
    header: 'Status'
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
        redeemDate={row.original.date}
        userId={row.original.user._id}
      />
    )
  }
];
