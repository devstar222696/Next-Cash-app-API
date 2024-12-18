'use client'
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Island House',
  description: 'Island House'
};

export default function OpenInBrowserPage() {

 const handleOpenInBrowser = () => {
  window.open('https://www.islandhousesweepstakes.com', '_blank');
 }
  
return (
    <div className="relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-[300px] flex-col space-y-6 sm:w-[350px]">
          <div className="flex w-full justify-center">
            <Image src="/logo.png" width={170} height={170} alt="logo image" />
          </div>
          <Button className="ml-auto w-full" type="button" handleClick={handleOpenInBrowser}>
            Open in Browser
          </Button>
        </div>
      </div>
    </div>
  );
}
