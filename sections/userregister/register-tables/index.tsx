/* eslint-disable @next/next/no-img-element */
'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import UserRegisterTableView from './user-register-table';
import UserRegistrationForm from './user-register-fron';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GameLink } from '@/sections/promotion/promotion-tables/game-link';
import Image from 'next/image';
import BackToHomeBtn from '@/components/BackToHomeBtn';
import BackToMypage from '@/components/BackToMypage';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export default function UserRegisterTable() {
  const router = useRouter();
  const [data, setData] = useState<(AdminRegisterUsers & UserRegister)[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  const page = Number(pageParam ? pageParam : 1);
  const limit = Number(limitParam ? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error('User not authenticated.');
        }

        setLoading(true);

        const response = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result.data[0]?.register || []);
        setTotalData(result.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userInfo]);

  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  const requestSuccess = () => {
    router.push('/mypage/promotion');
  };

  return (
    <div className="space-y-4 ">
      <div className="flex justify-center w-full">
        <img src="/pageTitle/001.png" alt="recharge" />
      </div>
      <div className="grid justify-items-center">
        <Image src="/IHRegisterNotice.png" width={1000} height={1000} alt="ad" />
      </div>
      <UserRegistrationForm />
      {/* <Button
        className="ml-[20%] w-[60%] border p-6 text-white"
        handleClick={requestSuccess}
      >
        Check Your Register Info
      </Button> */}
      <div className="grid w-full grid-cols-1 place-items-center">
        <div className="grid grid-cols-2 justify-items-center gap-2 lg:flex lg:justify-center">
          <BackToMypage width={300} />
          <BackToHomeBtn width={300} />
        </div>
      </div>
      <p className="text-medium py-5 text-center font-bold">Register History</p>
      <UserRegisterTableView
        columns={columns}
        data={paginatedData}
        totalItems={data.length}
      />
      <GameLink />
    </div>
  );
}
