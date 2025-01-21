'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MyPageTableView from './mypage-table';
import { Button } from '@/components/ui/button';
import TagId from '@/components/ui/tagId';
import { GameLink } from '@/sections/promotion/promotion-tables/game-link';
import VIPTagId from '@/components/ui/VipTagId';
import { Roles } from '@/constants/roles';
import Image from 'next/image';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export default function MyPageTable() {
  const router = useRouter();
  const [data, setData] = useState<UserRegister[]>([]);
  const [tag, setTag] = useState<AdminRegisterUsers[]>([]);
  const [totalData, setTotalData] = useState<number>(0); // Store total items for pagination
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
            Authorization: `Bearer ${userInfo.token}` // Assuming the token is sent this way
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        setTag(result.data);
        setData(result.data[0]?.register || []); // Adjust based on your API response
        setTotalData(result.totalCount); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userInfo]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  // Filter the data for status "complete"
  const filteredData = data.filter((item) => item.status === 'complete');

  const offset = (page - 1) * limit;
  const paginatedData = filteredData.slice(offset, offset + limit);

  const button = [
    {
      url: '/mypage/register',
      imgSrc: '/btn/001.png'
    },
    {
      url: '/mypage/deposit',
      imgSrc: '/btn/002.png'
    },
    {
      url: '/mypage/withdrawal',
      imgSrc: '/btn/003.png'
    },
    {
      url: '/mypage',
      imgSrc: '/btn/008.png'
    }
  ];

  return (
    <div className="space-y-4">
      {tag[0]?.role === Roles.vip_user ? (
        <VIPTagId tagId={tag[0]?.tag} />
      ) : (
        <TagId tagId={tag[0]?.tag} />
      )}
      <div>
        <p className="text-center text-xl font-semibold">User Info</p>
        <div className="mt-3 border py-8">
          <div className="flex justify-center">
            <p>Name:</p>
            <p className="ml-2">
              {tag[0]?.firstname} {tag[0]?.lastname}
            </p>
          </div>
          <div className="flex justify-center">
            <p>Email:</p>
            <p className="ml-2">{tag[0]?.email}</p>
          </div>
          <div className="flex justify-center">
            <p>Phone Number:</p>
            <p className="ml-2">{tag[0]?.phoneno}</p>
          </div>
        </div>
      </div>
      <p className="text-medium py-5 text-center font-bold">Login Info</p>
      <MyPageTableView
        columns={columns}
        data={paginatedData}
        totalItems={filteredData.length}
      />
      <div className="grid grid-cols-2 justify-items-center gap-2 lg:flex lg:justify-center">
        {button.map((btn) => (
          <Image
            src={btn.imgSrc}
            width={300}
            height={5}
            className="pt-[3px] hover:cursor-pointer hover:opacity-80"
            onClick={() => router.push(btn.url)}
            alt="btn"
            key={btn.imgSrc}
          ></Image>
        ))}
      </div>

      <GameLink />
    </div>
  );
}
