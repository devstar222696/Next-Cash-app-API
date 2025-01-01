'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckCircle, InfoIcon, MoreHorizontal, X } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRowState } from '@/app/shared/row-state-context';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  rowId?: string;
  registerDate:Date,
  userId: any,
  codeRegister?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CellAction: React.FC<CellActionProps> = ({
  rowId,
  registerDate,
  userId
}) => {
  const [loading, startTransition] = useTransition();
  const rowStates = useRowState();
  const router = useRouter();

  const registerAccept = async () => {
    startTransition(async () => {
      try {
        const { loginid, passwordcode } = (rowStates[rowId as unknown as number]!.current) as UserRegister & AdminRegisterUsers;
        const body = {
          status: 'complete',
          date: registerDate,
          id: userId,
          loginid, 
          passwordcode, 
        }
        const response = await userRegisterCheck(body);

        if (response.error) {
          console.error('Register error:', response.error);
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

  const userRegisterCheck = async (userData: {
    status: string;
    date: any;
    id: string;
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
        return { error: errorData.message || 'Register failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const unRegisterDecline = async () => {
    startTransition(async () => {
      try {
        const { loginid, passwordcode } = (rowStates[rowId as unknown as number]!.current) as UserRegister & AdminRegisterUsers;
        const body = {
          status: 'decline',
          date: registerDate,
          id: userId,
          loginid, 
          passwordcode, 
        }
        const response = await userRegisterCheck(body);

        if (response.error) {
          console.error('Decline error:', response.error);
          return;
        }

        toast({
          title: 'Decline Successful!',
          description: 'You have declined successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Decline Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userdetail = () => {
    router.push(`/main/user/userdetail?id=${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const ok = () => {};
  
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
          <DropdownMenuItem onClick={userdetail}>
            <InfoIcon className="mr-2 h-4 w-4" /> User Detail
          </DropdownMenuItem>
           <DropdownMenuItem onClick={registerAccept}>
            <CheckCircle className="mr-2 h-4 w-4" /> Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={unRegisterDecline}>
            <X className="mr-2 h-4 w-4" /> Decline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
