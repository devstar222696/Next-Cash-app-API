'use client'
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Island House',
  description: 'Island House'
};

export default function OpenInBrowserPage() {

  const handleOpenInBrowser = () => {
    window.open('https://www.islandhousesweepstakes.com', '_blank');
  }

  return (
    <div className="relative flex h-screen overflow-scroll flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex flex-col justify-center h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-[300px] flex-col space-y-6 sm:w-[350px]">
          <div className="flex w-full justify-center">
            <Image src="/logo.png" width={120} height={120} alt="logo image" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold my-2 text-center">Are you from Facebook or instagram?</h2>
            <Button className="flex flex-col m-auto max-w-fit sm:text-lg text-base" type="button" handleClick={handleOpenInBrowser}>
              Click to login using Email
            </Button>
          </div>
          <div>
            <p className="my-3 text-xl sm:text-2xl font-semibold text-red-500 text-center">We highly recommend using Chrome browser!</p>
            <h3 className="text-xl  sm:text-2xl font-medium text-center mb-2">For Google Login</h3>
            <div className="space-y-2 mt-2">
              <p className='sm:text-lg text-base font-medium'>There are two ways for using external browser:</p>
              <div className='sm:text-lg text-base'>1. Copy the link and open chrome browser manually.</div>
              <div className='sm:text-lg text-base'>2. Click to "Open in external browser" in Facebook or Instagram app.</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Image src="/Browser-img.png" width={450} height={450} alt="browser image" className='mx-auto' />
          </div>
        </div>
      </div>
    </div>
  );
}
