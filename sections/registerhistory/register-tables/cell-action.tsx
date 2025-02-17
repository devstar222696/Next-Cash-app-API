'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArchiveRestore, MoreHorizontal, Trash2, User2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  userId: any,
  redeemDate: Date
}

export const CellAction: React.FC<CellActionProps> = ({
  userId,
  redeemDate
}) => {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    startTransition(async () => {
      try {
        const response = await deleteRegisterCheck({
          id: userId,
          date: redeemDate
        });

        if (response.error) {
          return;
        }

        setOpen(false);

        toast({
          title: 'Delete successful!',
          description: 'You have verified customer redeem'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Delete Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const deleteRegisterCheck = async (userData: { id: string; date: any }) => {
    try {
      const response = await fetch('/api/admin/registerdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Delete failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  const restore = async () => {
    startTransition(async () => {
      try {
        const response = await userList({
          id: userId,
          status: 'Processing',
          date: redeemDate
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'User Restored Successful!',
          description: 'User have restored successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'User Restored Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userList = async (userData: {
    status: string;
    id: string;
    date: any;
  }) => {
    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const ok = () => { };

  const goToUserPage = () => {
    const url = `/main/user/userdetail?id=${userId}`
    window.open(url, '_blank')
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" handleClick={ok}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          {/* <DropdownMenuItem onClick={restore}>
            <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
          </DropdownMenuItem> */}
          {/* <AccessControl requiredPermissions={[PermissionsMap.delete]}>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          </AccessControl> */}
          <DropdownMenuItem onClick={goToUserPage}>
            <User2 className="mr-2 h-4 w-4" /> User Detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
