'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { getUserNameByPaymentType } from '@/lib/utils';
import { PaymentTypes } from '@/types';

export default function UserCashApp() {
  const router = useRouter();
  const [data, setData] = useState('');
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Cashtag Copied Successful!',
        description: 'Welcome! Cashtag have copied successfully.'
      });
    } else {
      toast({
        title: 'Cashtag Copied Failed!',
        description: 'Cashtag have copied failed. Please try again!'
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin', { cache: 'no-store' }); // Replace with your API endpoint
        const result = await response.json();
        const userName = result.data[0].cashtag;
        setData(userName);
        setUrl(`https://cash.app/${getUserNameByPaymentType(userName, PaymentTypes.CashApp)}?qr=1`);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  const back = () => {
    router.push('/mypage/deposit');
  };

  return (
    <div>
      <div className="mt-20 flex justify-center">
        {data !== 'none' ? (
          <div className="border p-2">
            <QRCodeSVG value={url} size={180} level={'H'} />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="mt-10 flex items-center justify-center">
        <input
          type="text"
          value={data}
          readOnly
          className="w-1/2 rounded-md border p-2 text-center outline-none"
          ref={inputRef}
        />
        <Button className="border py-5" handleClick={copyToClipboard}>
          Copy
        </Button>
      </div>
      <Button className="ml-[30%] mt-11 w-[40%] border p-6" handleClick={back}>
        OK
      </Button>
    </div>
  );
}
