import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { GamePromotionItem } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  tagNumber: number;
  game: string;
  amount: number;
}

interface GameRequestFormProps {}

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

const AddRequestForm: React.FC<GameRequestFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const [gameList, setGameList] = useState<GamePromotionItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRequest = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        tag: data.tagNumber,
        username: 'Test',
        gameid: data.game,
        paymentoption: data.game,
        paymenttype: 'Test',
        paymentgateway: 'Test',
        amount: data.amount,
      };

      const response = await fetch('/api/admin/withdrawalrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if(response.status == 404){
            throw new Error(`Error: User Not Found`);
        }else{
            throw new Error(`Error: ${response.statusText}`);
        }
      }

      toast({
        title: 'Request submitted successfully!',
        description: 'Your request has been processed.'
      });
      location.reload();
    } catch (error: any) {
      toast({
        title: error?.message || 'Failed to submit request',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  const onFormSubmit: SubmitHandler<FormData> = async (data) => {
    if(userInfo.userId){
       handleAddRequest(data);
    }
  };

  const fetchGameList = async () => {
    try {
      const response = await fetch('/api/admin/seasongame', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` // Assuming the token is sent this way
        },
        cache: 'no-store'
      });
      const result = await response.json();
      setGameList(result.data?.length > 0 ? result.data : 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex gap-4">
      <div>
        <Input
          type="number"
          className={`hide-number-arrows w-auto ${
            errors.tagNumber ? 'border-red-500' : ''
          }`}
          placeholder="TAG NUMBER"
          {...register('tagNumber', {
            required: 'Tag number is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Tag number must be greater than 0' }
          })}
        />
        {errors.tagNumber && (
          <p className="mt-1 text-sm text-red-500">
            {errors.tagNumber.message}
          </p>
        )}
      </div>

      <div>
        <select
          id="gameList"
          className={`h-9 w-[200px] focus:border-[#DAAC95] dark:focus:border-[#5d32f5] rounded-md border bg-background p-2 text-sm outline-none ${
            errors.game ? 'border-red-500' : ''
          }`}
          {...register('game', {
            required: 'Please select a game'
          })}
        >
          <option value="">Select a game</option>
          {gameList.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.game && (
          <p className="mt-1 text-sm text-red-500">{errors.game.message}</p>
        )}
      </div>

      <div>
        <Input
          type="number"
          className={`hide-number-arrows w-auto ${
            errors.amount ? 'border-red-500' : ''
          }`}
          placeholder="AMOUNT"
          {...register('amount', {
            required: 'Amount is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Amount must be greater than 0' }
          })}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="outline"
        className=""
        disabled={isSubmitting}
        handleClick={() => {}}
      >
        Add Request
      </Button>
    </form>
  );
};

export default AddRequestForm;
