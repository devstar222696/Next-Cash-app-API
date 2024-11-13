'use client';

import { AdminRegisterUsers } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import UserdetailTablePage from './userdetail-table';
import { useSearchParams } from 'next/navigation';
import UserdetailInfo from './userdetail-info';

export default function UserdetailTable() {
  const [data, setData] = useState<AdminRegisterUsers[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  
  const id = searchParams.get("id");
  
  useEffect(() => {
    if (!id) return;  // Return early if 'id' is not available
    
    async function fetchData() {
      try {
        setLoading(true);

        // Send the 'id' as a query parameter in the GET request
        const response = await fetch('/api/admin/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${id}` 
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setData(result.data || []); // Use an empty array if no register is found
          setTotalData(result.totalCount || 0);
        } else {
          console.error('No data found in the result:', result);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  return (
    <div className="lg:flex">
      <div className='w-full lg:w-[400px]'>
      <UserdetailInfo />
      </div>
      <div className='w-full ml-2 mt-5 lg:mt-0'>
      <UserdetailTablePage columns={columns} data={data} totalItems={totalData} />
      </div>
    </div>
  );
}
