import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from '../user-auth-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-[300px] flex-col space-y-6 sm:w-[350px]">
          <div className="flex w-full justify-center">
            <Image src="/IH-LOGO.png" width={170} height={170} alt="logo image" />
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Login page
          </h1>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
