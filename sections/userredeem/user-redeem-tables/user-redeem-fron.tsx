'use client';

import { useState, useTransition, useEffect, useRef, useMemo } from 'react';
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
import { QRCodeSVG } from 'qrcode.react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AdminRegisterUsers,
  paymentOption,
  UserRegister
} from '@/constants/data';
import useSocket from '@/lib/socket';
import { Roles } from '@/constants/roles';

const formSchema = z.object({
  amount: z.any()
});

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

type UserFormValue = z.infer<typeof formSchema>;

const COOLDOWN_KEY = 'cooldown_data';

const DEPOSIT_URLS: Record<string, string> = {
  CashApp: '/mypage/deposit/cashapp',
  Bitcoin: '/mypage/deposit/bitcoin',
  Venmo: '/mypage/deposit/venmo',
  Paypal: '/mypage/deposit/paypal',
  Zelle: '/mypage/deposit/zelle',
  USDT: '/mypage/deposit/usdt',
};
interface IUserReemFormProps {
  setTagId: (args: AdminRegisterUsers | null) => void;
}

export default function UserredeemForm({ setTagId }: IUserReemFormProps) {
  const router = useRouter();
  const { socket } = useSocket();
  const [loading, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [bitcoin, setBitcoin] = useState('0.00000000');
  const [game, setGame] = useState<string[]>([]);
  const [gamesByName, setGameByName] = useState<{ [key: string]: UserRegister }>({});
  const [selectedredeem, setSelectedredeem] = useState('CashApp');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isDailyBonus, setIsDailyBonus] = useState(false);
  const [isMatchBonus, setIsMatchBonus] = useState(false);
  const [isVipFreeplay, setIsVipFreeplay] = useState(false);
  const [data, setData] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
        setData(result.data[0].bitcoin);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

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
        setTagId(result?.data[0]);
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

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await userredeem({
          paymentoption: selectedPayment,
          paymenttype: selectedredeem,
          amount: data.amount,
          btc: bitcoin,
          token: userInfo.token,
          id: userInfo.userId,
          isChecked: isDailyBonus,
          isMatchBonus: isMatchBonus,
          isVipFreeplay: isVipFreeplay, 
        });

        if (response.error) {
          toast({
            title: 'Request Failed!',
            description: response.error
          });
          return;
        }

        socket?.emit('userDeposit', {
          userId: userInfo.userId,
          message: `${userInfo.name} requested deposit!`
        });

        router.push(DEPOSIT_URLS[selectedredeem]);

        toast({
          title: 'Deposit Request Successful!',
          description: 'Welcome! Your deposit request has been request.'
        });

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
          title: 'Deposit Request Failed!',
          description: 'Your request has been failed. Please try again!'
        });
      }
    });
  };

  const userredeem = async (userData: {
    paymentoption: string;
    paymenttype: string;
    amount: any;
    token: string;
    btc: string;
    id: any;
    isChecked: boolean;
    isMatchBonus: boolean;
    isVipFreeplay: boolean; 
  }) => {
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');

    let formattedValue = '0.00000000';

    if (rawValue.length > 0) {
      const valueAsNumber = parseInt(rawValue, 10);
      formattedValue = (valueAsNumber / 100000000).toFixed(8);
    }

    e.target.value = formattedValue;
    setBitcoin(formattedValue);
  };

  const uniqueGames = Array.from(new Set(game));

  const options = uniqueGames.map((game) => (
    <option key={game} value={game}>
      {game}
    </option>
  ));

  console.log(selectedPayment);

  const ok = () => { };

  const allowRequest = useMemo(() => {
    console.log('selectedPayment', gamesByName[selectedPayment]);
    return gamesByName[selectedPayment]?.status === 'complete';
  }, [selectedPayment, gamesByName]);

  return (
    <div>
      {/* <div className="w-full rounded-xl border border-4 border-solid border-gray-300 bg-indigo-600 p-3">
        <p className="text-center font-semibold text-red-500">※Warning※</p>
        <p className="mt-2 text-center text-sm font-semibold text-white ">
          When you Deposit, please make sure to enter your 'Tag Number' in the
          'Note' if you do not enter the correct information, loading may be
          very slow.
          <br /> Thank you🙂
        </p>
      </div> */}
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
                Deposit Type
              </label>
              <select
                id="CashApp"
                value={selectedredeem}
                onChange={(e) => setSelectedredeem(e.target.value)}
                className="mt-3 h-9 w-[200px] rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                {paymentOption.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            {selectedredeem === 'Bitcoin' ? (
              <div className="flex flex-wrap justify-center sm:flex-nowrap">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex justify-center">
                      <FormLabel className="sx:w-28 mr-[5px] mt-4 sm:mr-[10px]">
                        Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-[70px]"
                          disabled={loading || cooldown}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, '');
                          }}
                          placeholder="USD"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="ml-[10px] mt-2 flex h-9 w-[140px] items-center rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]">
                  <input
                    className="block min-w-0 grow"
                    value={`${bitcoin}`}
                    onChange={handleInputChange}
                    placeholder="BTC"
                  />
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                    BTC
                  </div>
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormLabel className="mt-4 w-28">Amount</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[200px]"
                        disabled={loading || cooldown}
                        {...field}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.value = target.value.replace(/[^0-9]/g, '');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="mx-auto mt-[10px] flex gap-4 max-w-[312px] items-center">
              <p className='text-sm font-medium w-[140px]'>Match Bonus 100%</p>
              <Checkbox
                checked={isMatchBonus}
                onCheckedChange={(value: boolean) => setIsMatchBonus(value)}
                aria-label="Select Match Bonus"
                disabled={loading || cooldown}
              />
            </div>
            <div className="mx-auto mt-[10px] flex gap-4 max-w-[312px] items-center">
              <p className='text-sm font-medium w-[140px]'>VIP Daily FREEPLAY</p>
              <Checkbox
                checked={isVipFreeplay}
                onCheckedChange={(value: boolean) => setIsVipFreeplay(value)}
                aria-label="Select VIP Daily FREEPLAY"
                disabled={loading || cooldown}
              />
            </div>
            <div className="mx-auto mt-[10px] flex gap-4 max-w-[312px] items-center">
              <p className='text-sm font-medium w-[140px]'>Daily Bonus 20%</p>
              <Checkbox
                checked={isDailyBonus}
                onCheckedChange={(value: boolean) => setIsDailyBonus(value)}
                aria-label="Select row"
                disabled={loading || cooldown}
              />
            </div>
          </div>
          <Button
            disabled={loading || cooldown || !allowRequest}
            className="ml-[30%] mt-11 w-[40%] p-6 text-white"
            type="submit"
            handleClick={ok}
          >
            {cooldown ? `Waiting (${remainingTime}s)` : 'REQUEST'}
          </Button>
        </form>
      </Form>
      <div className="">
        {selectedredeem === 'Bitcoin' ? (
          <>
            <div className="mx-auto mt-8 flex w-max flex-col border p-2">
              <QRCodeSVG value={data} size={180} level={'H'} />
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
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
