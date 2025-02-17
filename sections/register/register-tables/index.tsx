'use client';

import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect, useTransition, useMemo } from 'react';
import RegisterTablePage from './register-table';
import { Button } from '@/components/ui/button';
import useSocket from '@/lib/socket';
import { toast } from '@/components/ui/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import {
  setInitialRowState,
  useRowDispatch,
  useRowState
} from '@/app/shared/row-state-context';
import AccessControl from '@/components/accessControl';
import { PermissionsMap } from '@/constants/permissions';

interface SelectMultiIdData {
  id?: string;
  date?: string;
  rowId?: number;
}

export default function RegisterTable() {
  const { socket } = useSocket();
  const [data, setData] = useState<(AdminRegisterUsers & UserRegister)[]>([]);
  const [currentData, setCurrentData] =
    useState<(AdminRegisterUsers & UserRegister)[]>(data);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [multiIds, setMultiIds] = useState<SelectMultiIdData[]>([]);
  const [load, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  const page = Number(pageParam ? pageParam : 1);
  const limit = Number(limitParam ? limitParam : 10);
  const rowStates = useRowState();
  const rowDispatch = useRowDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const registerResponse = await fetch('/api/admin/getregister', {
          cache: 'no-store'
        });
        const registerResult = await registerResponse.json();

        const usersResponse = await fetch('/api/admin/getregister', {
          cache: 'no-store'
        });
        const usersResult = await usersResponse.json();

        const filteredWithdrawals = registerResult.data.flatMap(
          (registerEntry: any) =>
            registerEntry.register.filter(
              (register: UserRegister) =>
                register.status === 'Processing' ||
                register.status === 'preparing'
            )
        );

        const combinedData = filteredWithdrawals.map(
          (register: UserRegister) => {
            const user = usersResult.data.find(
              (user: AdminRegisterUsers) => user._id === register.id
            );
            return { ...register, user };
          }
        );

        const sortedData = combinedData.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date:', a.date, b.date);
            return 0;
          }

          return dateB.getTime() - dateA.getTime();
        });

        const dataWithRowId = sortedData.map((item: any, index: number) => ({
          ...item,
          rowId: (index + 1).toString()
        }));
        dataWithRowId.forEach((row: any) => {
          console.log('set initial state', row);
          setInitialRowState(rowDispatch, (row as any).rowId, row);
        });

        setData(dataWithRowId);
        setTotalData(dataWithRowId.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [rowDispatch]);

  useEffect(() => {
    socket?.on('selectRegisterMultiIds', (data: any) => {
      setMultiIds(data);
    });
  }, []);

  useEffect(() => {
    const handleSelectMultiId = (data: SelectMultiIdData) => {
      if (!data.id && data.date) {
        setMultiIds((prevMultiIds) =>
          prevMultiIds.filter((item) => item.date !== data.date)
        );
      } else {
        setMultiIds((prevMultiIds) => [...prevMultiIds, data]);
      }
    };

    socket?.on('selectRegisterMultiId', handleSelectMultiId);

    return () => {
      socket?.off('selectRegisterMultiId', handleSelectMultiId);
    };
  }, []);

  const multiDecline = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Decline Failed!',
        description: 'Please check item!'
      });
      return;
    }
    startTransition(async () => {
      try {
        const response = await userMultiCheck({
          status: 'decline',
          data: multiIds
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
          title: 'Decline Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const multiAccept = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Accept Failed!',
        description: 'Please check item!'
      });
      return;
    }
    const payload = multiIds.map((item) => {
      const { loginid, passwordcode } = (rowStates[item.rowId as unknown as number]!.current) as UserRegister & AdminRegisterUsers;
      return ({
        status: 'complete',
        date: item.date as string,
        id: item.id as string,
        loginid,
        passwordcode
      })
    })  
    startTransition(async () => {
      try {
        const response = await userMultiCheck({
          status: 'complete',
          data: payload
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

  const userMultiCheck = async (userData: { status: string; data: any }) => {
    try {
      const response = await fetch('/api/admin/multiRegisterCheck', {
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

  const offset = (page - 1) * limit;

  const paginatedData = useMemo(
    () => data.slice(offset, offset + limit),
    [data, offset, limit]
  );

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  return (
    <div className="space-y-4 ">
      <AccessControl
        requiredPermissions={[
          PermissionsMap.multi_accept,
          PermissionsMap.multi_decline
        ]}
      >
        <div className="flex justify-end">
          <Button variant="outline" handleClick={multiAccept} className="mr-3">
            Multi Accept
          </Button>
          <Button variant="outline" handleClick={multiDecline}>
            Multi Decline
          </Button>
        </div>
      </AccessControl>
      <RegisterTablePage
        columns={columns as ColumnDef<UserRegister & AdminRegisterUsers>[]}
        data={paginatedData}
        setData={setCurrentData}
        totalItems={totalData}
      />
    </div>
  );
}
