'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { updateRowState, useRowDispatch } from '@/app/shared/row-state-context';

interface UserData {
  id: string;
  amount: string | number;
  date: string;
}

export const AmountAction = ({
  rowId,
  redeemDate,
  userId,
  redeemAmountV,
  bitcoin
}: {
  rowId: string;
  redeemDate: any;
  userId: string;
  redeemAmountV: number | string;
  bitcoin: string;
}) => {
  const rowDispatch = useRowDispatch();
  const [amount, setAmount] = useState<string | number>(redeemAmountV);

  const userData: UserData = {
    id: userId,
    amount: amount,
    date: redeemDate
  };

  useEffect(() => {
    if (redeemAmountV) {
      setAmount(redeemAmountV);
    } else {
      setAmount('');
    }
  }, [redeemAmountV]);

  const onSubmit = async (userData: UserData) => {
    if (amount === null || amount === undefined || amount === '') {
      toast({
        title: 'Amount empty!',
        description: 'Please input amount!'
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/redeemamount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Amount updating failed' };
      }

      toast({
        title: 'Amount updating Successful!',
        description: 'Welcome! Amount updating has been successful.'
      });

      location.reload();

      return await response.json();
    } catch (error) {
      toast({
        title: 'Amount updating Failed!',
        description: 'Amount updating has failed. Please try again.'
      });
      throw error;
    }
  };

  const handleButtonClick = async () => {
    const response = await onSubmit(userData);

    if (response && response.error) {
      console.error(response.error);
    } else {
      console.log('Success:', response);
    }
  };

  return (
    <div className="relation flex justify-center">
      <input
        className=" w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={amount}
        onChange={(e) => {
          const sanitizedValue = e.target.value.replace(/[^0-9VB]/g, '');
          updateRowState(rowDispatch, rowId, { id: userId, amount: sanitizedValue });
          setAmount(sanitizedValue);
        }}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^0-9VB]/g, '');
        }}
      />
      <Button
        className="ml-1 h-8 bg-blue-500 px-1 text-xs text-white"
        handleClick={handleButtonClick}
      >
        UPDATE
      </Button>

      <div className="group relative flex flex-col items-center">
        <Image
          src="/bitcoin.png"
          width={30}
          height={18}
          alt="bitcoin"
          className="ml-1"
        />
        <div className="absolute bottom-3 mb-5 flex hidden flex-col items-center group-hover:flex">
          <span className="whitespace-no-wrap relative z-10 rounded-md bg-black p-2 text-xs leading-none text-white shadow-lg">
            {bitcoin}
          </span>
        </div>
      </div>
    </div>
  );
};
