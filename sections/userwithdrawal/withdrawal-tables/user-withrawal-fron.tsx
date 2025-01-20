'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
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
import Image from 'next/image';
import { paymentOption, UserRegister } from '@/constants/data';
import { StorageKeys } from '@/constants/storage';
import BackToHomeBtn from '@/components/BackToHomeBtn';


const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

// type UserFormValue = z.infer<typeof formSchema>;

const COOLDOWN_KEY = 'cooldown_data';

export default function UserWithdrawalForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const formSchema = z.object({
    amount: z.string()
    .min(1, "Amount is required.") // Ensure the field is not empty
    .refine((value) => !isNaN(Number(value)), {
      message: "Amount must be a valid number.",
    })
    .refine(
      (value) => selectedWithdrawal === 'Bitcoin' || Number(value) >= 50,
      {
        message: "Amount must be at least 50.",
      }
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const [game, setGame] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState('CashApp');
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [gamesByName, setGameByName] = useState<{[key:string]: UserRegister}>({});

  useEffect(() => {
    const cooldownData = localStorage.getItem(COOLDOWN_KEY);
    if (cooldownData) {
      const { cooldown: savedCooldown, remainingTime: savedRemainingTime } =
        JSON.parse(cooldownData);
      setCooldown(savedCooldown);
      setRemainingTime(savedRemainingTime);
    }
  }, []);

  useEffect(() => {
    if (cooldown) {
      const intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setCooldown(false);
            localStorage.removeItem(COOLDOWN_KEY);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      localStorage.setItem(
        COOLDOWN_KEY,
        JSON.stringify({ cooldown, remainingTime })
      );

      return () => {
        clearInterval(intervalId);
      };
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }, [cooldown, remainingTime]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error('User not authenticated.');
        }

        const response = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const registerArray = result.data[0]?.register || [];

        const gamesKeyByName = registerArray.reduce((acc: any, item: any) => {
          acc[item.category] = item;
          return acc;
        }, {});
        setGameByName(gamesKeyByName);

        const categories = registerArray.map((item: any) => item.category);
        setGame(categories);
        setSelectedPayment(categories[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [userInfo]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const withdrawalData = {
          amount: data.amount,
          paymentoption: selectedPayment,
          paymenttype: selectedWithdrawal
        }

        localStorage.setItem(StorageKeys.withdrawalData, JSON.stringify(withdrawalData));

        // const response = await userWithdrawal({
        //   token: userInfo.token,
        //   id: userInfo.userId,
        //   amount: data.amount,
        //   paymentoption: selectedPayment,
        //   paymenttype: selectedWithdrawal
        // });

        // if (response.error) {
        //   console.error('Withdrawal error:', response.error);
        //   return;
        // }

        router.push('/mypage/withdrawal/withdrawalmiddle');

        setCooldown(true);
        localStorage.setItem(
          COOLDOWN_KEY,
          JSON.stringify({ cooldown: true, remainingTime: 59 })
        );

        setTimeout(() => {
          setCooldown(false);
          localStorage.removeItem(COOLDOWN_KEY);
        }, 30000);
      } catch (error) {
        toast({
          title: 'Withdrawal Failed!',
          description: 'Welcome! Your withdrawal has been failed.'
        });
      }
    });
  };

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

  const uniqueGames = Array.from(new Set(game));

  const options = uniqueGames.map((game) => (
    <option key={game} value={game}>
      {game}
    </option>
  ));

  const ok = () => { };

  const allowRequest = useMemo(() => {
      console.log('selectedPayment', gamesByName[selectedPayment]);
    return gamesByName[selectedPayment]?.status === 'complete';
  }, [selectedPayment, gamesByName]);

  return (
    <div>
      <div className="flex justify-center w-full">
        <Image
          src="/IH_register_3.png"
          width={500}
          height={200}
          className="mt-1 hover:opacity-80 lg:ml-2 lg:mt-0"
          alt="redeem"
        ></Image>
      </div>
      <div className="grid justify-items-center">
          <Image src="/IHRedeemNotice.png" width={1000} height={1000} alt="ad" />
        </div>
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div>
            <div className="flex justify-center">
              <label className="mt-4 w-28 text-sm font-medium">Category</label>
              <select
                id="gameSelect"
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mt-3 h-9 w-[200px] rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                {options}
              </select>
            </div>
            <div className="flex justify-center">
              <label className="mt-4 w-28 text-sm font-medium">
                Withdraw Type
              </label>
              <select
                id="CashApp"
                value={selectedWithdrawal}
                onChange={(e) => setSelectedWithdrawal(e.target.value)}
                className="mt-3 h-9 w-[200px] rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                {paymentOption.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-wrap justify-center">
                  <FormLabel className="mt-3 w-28">Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading || cooldown}
                      {...field}
                      className="w-[200px]"
                      // onInput={(e) => {
                      //   const target = e.target as HTMLInputElement;
                      //   target.value = target.value.replace(/[^0-9]/g, '');
                      // }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading || cooldown || !allowRequest}
            className="ml-[30%] mt-11 w-[40%] p-6 text-white"
            type="submit"
            handleClick={ok}
          >
            {cooldown ? `Waiting (${remainingTime}s)` : 'REQUEST'}
          </Button>
          <div className='flex justify-center mt-6'>
            <BackToHomeBtn />
          </div>
        </form>
      </Form>
    </div>
  );
}
