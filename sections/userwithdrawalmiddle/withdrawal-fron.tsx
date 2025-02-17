// UserRegistrationForm.client.js
'use client'; // Ensures this is recognized as a client component

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { StorageKeys } from '@/constants/storage';
import useSocket from '@/lib/socket';
import Image from 'next/image';

const formSchema = z.object({
  paymentgateway: z.string()
});

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
type UserFormValue = z.infer<typeof formSchema>;

export default function UserWithdrawalMiddle() {
  const router = useRouter();
  const { socket } = useSocket();
  const [loading, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const userWithdrawal = async (userData: {
    token: string;
    paymentoption: string;
    paymenttype: string;
    amount: number;
    id: any;
  }) => {
    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Withdrawal failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const onSubmit = async (data: UserFormValue) => {
    const withDrawalData = localStorage.getItem(StorageKeys.withdrawalData);
    const withDrawalInfo = withDrawalData ? JSON.parse(withDrawalData) : null;
    if (!withDrawalInfo) {
      toast({
        title: 'Failed to Submit Withdrawal Request!',
        description:
          'Please submit your withdrawal info in first page and try again.'
      });
      router.push('/mypage/withdrawal');
      return false;
    }
    startTransition(async () => {
      const response = await userWithdrawal({
        token: userInfo.token,
        id: userInfo.userId,
        paymentgateway: data.paymentgateway,
        ...withDrawalInfo
      });

      if (response.error) {
        console.error('Signup error:', response.error);
        return;
      }

      socket?.emit('userWithdrawal', {
        userId: userInfo.userId,
        message: `${userInfo.name} requested withdrawal!`
      });

      toast({
        title: 'Withdrawal Request Successful!',
        description: 'Welcome! Your withdrawal has been request.'
      });

      router.push('/mypage');
    });
  };

  const signUp = async (userData: {
    paymentgateway: string;
    token: string;
  }) => {
    try {
      const response = await fetch('/api/customer/withdrawalrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Signup failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const withdrawalmiddle = () => {};

  return (
    <div>
      <div>
        <Image
          height={300}
          width={400}
          src={'/pageTitle/redeem.png'}
          alt="notice"
          className="m-auto mb-5"
        ></Image>
        <Image
          height={300}
          width={500}
          src={'/IH withdrawal notice-001.png'}
          alt="notice"
          className="m-auto"
        ></Image>
      </div>
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div>
            <FormField
              control={form.control}
              name="paymentgateway"
              render={({ field }) => (
                <FormItem className="ml-[25%] mt-10 w-[50%]">
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-[25%] mt-32 w-[50%] p-6"
            handleClick={withdrawalmiddle}
          >
            REQUEST
          </Button>
        </form>
      </Form>
    </div>
  );
}
