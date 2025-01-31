'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckCircle, MoreHorizontal, X, User2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRowState } from '@/app/shared/row-state-context';
import { AdminRegisterUsers, Paymentredeems } from '@/constants/data';

interface CellActionProps {
  rowId: string;
  Date: Date;
  userId: any;
  originalAmount: string | number;
}

export const CellAction: React.FC<CellActionProps> = ({
  rowId,
  Date,
  userId,
  originalAmount
}: { rowId: string; Date: Date; userId: any; originalAmount: string | number }) => {
  const [loading, startTransition] = useTransition();
  const rowStates = useRowState();

  const accept = async () => {
    startTransition(async () => {
      try {
        const { amount } = (rowStates[rowId as unknown as number]?.current) as Paymentredeems & AdminRegisterUsers ?? { amount: originalAmount };
        const response = await userredeemCheck({
          id: userId,
          paymentstatus: 'complete',
          date: Date,
          amount: amount
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Accept Successful!',
          description: 'You have accepted successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Accept Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userredeemCheck = async (userData: {
    paymentstatus: string;
    id: string;
    date: any;
    amount: string | number;
  }) => {
    try {
      const response = await fetch('/api/admin/redeem', {
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

  const unredeem = async () => {
    const { amount } = (rowStates[rowId as unknown as number]?.current) as Paymentredeems & AdminRegisterUsers ?? { amount: originalAmount };

    startTransition(async () => {
      try {
        const response = await userUnredeemCheck({
          id: userId,
          paymentstatus: 'decline',
          date: Date,
          amount: amount
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Decline Successful!',
          description: 'You have declined successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'redeem Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userUnredeemCheck = async (userData: {
    paymentstatus: string;
    id: string;
    date: any;
    amount: string | number;
  }) => {
    try {
      const response = await fetch('/api/admin/redeem', {
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

  const goToUserPage = () => {
    const url = `/main/user/userdetail?id=${userId}`
    window.open(url, '_blank')
  }

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  const ok = () => { };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" handleClick={ok}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={accept}>
            <CheckCircle className="mr-2 h-4 w-4" /> Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={unredeem}>
            <X className="mr-2 h-4 w-4" /> Decline
          </DropdownMenuItem>
          <DropdownMenuItem onClick={goToUserPage}>
            <User2 className="mr-2 h-4 w-4" /> User Detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
