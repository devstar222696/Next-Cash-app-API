'use client';

import { columns } from './columns';
import { useState, useEffect, useTransition } from 'react';
import { Paymentredeems, AdminRegisterUsers, UserRegister } from '@/constants/data';
import AdminredeemHistoryTableView from './register-table';
import useSocket from '@/lib/socket';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

interface SelectMultiIdData {
  id?: string;
  date?: string;
}

export default function AdminRegisterHistoryTable() {

  const { socket } = useSocket();
  const [data, setData] = useState<(Paymentredeems & AdminRegisterUsers)[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [multiIds, setMultiIds] = useState<SelectMultiIdData[]>([]);
  const [load, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  const page = Number(pageParam ? pageParam : 1);
  const limit = Number(limitParam ? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const registerResponse = await fetch('/api/admin/getregister', { cache: 'no-store' });
        const registerResult = await registerResponse.json();

        const usersResponse = await fetch('/api/admin/getregister', { cache: 'no-store' });
        const usersResult = await usersResponse.json();

        const filteredRegister = registerResult.data.flatMap(
          (registerEntry: any) =>
            registerEntry.register.filter(
              (register: UserRegister) =>
                register.status === 'decline' || register.status === 'complete'
            )
        );

        const combinedData = filteredRegister.map(
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

        setData(sortedData);
        setTotalData(registerResult.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const multiRestore = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Restore Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userMultiCheck({
          status: 'Processing',
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Restore Successful!',
          description: 'You have restored successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Restore Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userMultiCheck = async (userData: {
    status: string;
    data: any;
  }) => {
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

  const multiDelete = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Delete Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userDeleteMultiCheck({
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Delete Successful!',
          description: 'You have deleted successful!'
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

  const userDeleteMultiCheck = async (userData: { data: any }) => {
    try {
      const response = await fetch('/api/admin/multiRegisterDelete', {
        method: 'DELETE',
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
  const paginatedData = data.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="space-y-4 ">
      <div className="flex justify-end">
        <Button
          variant="outline"
          handleClick={multiRestore}
          className="mr-3 mt-3"
        >
          Multi Restore
        </Button>
        <Button
          variant="outline"
          handleClick={multiDelete}
          className="mr-3 mt-3"
        >
          Multi Delete
        </Button>
      </div>
      <AdminredeemHistoryTableView
        columns={columns}
        data={paginatedData}
        totalItems={data.length}
      />
    </div>
  );
}
