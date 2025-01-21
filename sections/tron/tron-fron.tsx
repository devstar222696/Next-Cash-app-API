'use client';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import BackToHomeBtn from '@/components/BackToHomeBtn';
import HeaderImg from '@/components/HeaderImg';

export default function TronForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState('');


  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Tron Address Copied Successful!',
        description: 'Welcome! Tron address have copied successfully.'
      });
    } else {
      toast({
        title: 'Tron Address Copied Failed!',
        description: 'Tron address have copied failed. Please try again!'
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
        setData(result.data[0].tron); //check key name
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <HeaderImg src="/paymentHeader/trc.png" />
      {data !== 'none' ? (
        <div className="mt-10 flex justify-center">
          <div className="border p-2">
            <QRCodeSVG value={data} size={180} level={'H'} />
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
      <BackToHomeBtn className="m-auto" />
    </div>
  );
}
