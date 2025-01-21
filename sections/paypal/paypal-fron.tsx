'use client';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getUserNameByPaymentType } from '@/lib/utils';
import { PaymentTypes } from '@/types';
import BackToHomeBtn from '@/components/BackToHomeBtn';
import HeaderImg from '@/components/HeaderImg';
import Image from 'next/image';

export default function UserPaypal() {
  const router = useRouter();
  const [data, setData] = useState('');
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const paypal = () => {
    router.push('/mypage/deposit');
  };

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Paypal Copied Successful!',
        description: 'Welcome! Paypal have copied successfully.'
      });
    } else {
      toast({
        title: 'Paypal Copied Failed!',
        description: 'Paypal have copied failed. Please try again!'
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin', {
          cache: 'no-store'
        });
        const result = await response.json();
        const userName = result.data[0].paypal;
        setData(userName);
        setUrl(
          `https://paypal.me/${getUserNameByPaymentType(
            userName,
            PaymentTypes.PayPal
          )}`
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <HeaderImg src="/paymentHeader/pp.png" />
      {data !== 'none' ? (
        <div className="mt-10 flex justify-center">
          <div className="border p-2">
            <QRCodeSVG value={url} size={180} level={'H'} />
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="my-10 flex items-center justify-center">
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
      <Image
        src="/IH PayPal Notice.png"
        width={400}
        height={100}
        alt="notice"
        className='m-auto'
      ></Image>

      <BackToHomeBtn className="m-auto" />
    </div>
  );
}
