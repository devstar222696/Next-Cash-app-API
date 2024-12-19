'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sendCodeToDb, sendCodeToEmail } from '@/app/utils/emilverify';

interface UserData {
  code: string;
  email: string | null;
  verifystatus: string;
}

const verifyEmail = localStorage.getItem('verifyemail');
const userEmail = verifyEmail ? JSON.parse(verifyEmail) : {};

export default function EmailCodeVerifyPage() {
  const router = useRouter();
  const [emailcode, setEmailCode] = useState('');

  const userData: UserData = {
    code: emailcode,
    email: userEmail,
    verifystatus: 'yes'
  };

  const onSubmit = async (userData: UserData) => {
    try {
      const response = await fetch('/api/emailcodeverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Code sending failed' };
      }

      toast({
        title: 'EmailCode verify Successful!',
        description: 'Welcome! Your code sending has been successful.'
      });

      router.push('/');

      return await response.json();
    } catch (error) {
      toast({
        title: 'Code Verify Failed!',
        description: 'Your action has failed. Please try again.'
      });
      throw error;
    }
  };

  const verifyEmailCode = async () => {
    const response = await onSubmit(userData);

    if (response && response.error) {
      console.error(response.error);
    } else {
      console.log('Success:', response);
    }
  };

  const resendCode = async () => {
    if (!userEmail) {
      toast({
        title: 'Email Address Missing',
        description:
          'Please enter a valid email address to resend the verification code.'
      });
    }
    const code = Math.floor(100000 + Math.random() * 900000);

    let response = await sendCodeToEmail({ userEmail, code });

    let data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email.');
    }

    response = await sendCodeToDb({ userEmail, code });

    data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save code in database.');
    }

    toast({
      title: 'Sent successfully!',
      description: 'Verification email sent and code saved successfully!'
    });
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center ">
      <div className="h-fit w-[350px] border border-2 p-8 md:w-1/3">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Email Verification
        </h1>
        <div className="mt-5 flex w-full justify-center">
          <input
            className="w-96 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            maxLength={6}
            onChange={(e) => setEmailCode(e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, '');
            }}
          />
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-4">
          <Button
            variant="default"
            handleClick={verifyEmailCode}
            className="w-full whitespace-nowrap text-white xl:w-96 2xl:w-96"
          >
            Email Code Verify
          </Button>
          <Button
            variant="default"
            handleClick={resendCode}
            className="w-full whitespace-nowrap text-white  xl:w-96 2xl:w-96"
          >
            Resend Code
          </Button>
          <span className="text-center text-sm">
            It may take 0-3 minutes. If you have not received the verification
            number, please check your Spam folder
          </span>
        </div>
      </div>
    </div>
  );
}
