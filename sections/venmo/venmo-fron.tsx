'use client';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { getUserNameByPaymentType } from '@/lib/utils';
import { PaymentTypes } from '@/types';

export default function UserVenmo() {
  const router = useRouter();
  const [data, setData] = useState('');
  const [userName, setUserName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin', { cache: 'no-store' });
        const result = await response.json();
        const venmoUserName = result.data[0].venmo;
        setData(venmoUserName);
        setUserName(getUserNameByPaymentType(venmoUserName, PaymentTypes.Venmo));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  const venmoLink = useMemo(() => `https://venmo.com/u/${userName}`, [userName]);

  useEffect(() => {
    async function qrcodeData() {
      try {
        const url = await QRCode.toDataURL(venmoLink);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Failed to generate QR code', error);
      }
    }

    qrcodeData();
  }, [venmoLink]);

  const venmo = () => {
    router.push('/mypage/deposit');
  };

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Venmo Copied Successful!',
        description: 'Welcome! Venmo have copied successfully.'
      });
    } else {
      toast({
        title: 'Venmo Copied Failed!',
        description: 'Venmo have copied failed. Please try again!'
      });
    }
  };  

  return (
    <div>
      <div className="mt-20 flex justify-center">
        {qrCodeUrl && data !== 'none' && (
          <div className="border p-2">
            <img
              src={qrCodeUrl}
              alt={`QR Code for ${data}`}
              className="w-[200px], h-[200px]"
            />
          </div>
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
      <Button className="ml-[30%] mt-28 w-[40%] border p-6" handleClick={venmo}>
        OK
      </Button>
    </div>
  );
}
