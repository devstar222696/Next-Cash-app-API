'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { GamePromotionItem } from '@/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

const SeasonGameList = () => {
  const [promotionList, setPromotionList] = useState<GamePromotionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
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
        setPromotionList(result.data);
       
      } catch (error) {
        toast({
          title: 'Somethings went wrong',
          description: 'Please try again!'
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCheckBox = (value: boolean, index: number) => {
    const cloneGame = [...promotionList];
    cloneGame[index].isfavourite = value;
    setPromotionList(() => cloneGame);
  };

  const updateGameList = async () => {
    try {
      setIsUpdating(true);
      await fetch('/api/admin/seasongame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          games: promotionList.map((game) => ({
            isfavourite: game.isfavourite,
            id: game._id
          }))
        })
      });
      toast({
        title: 'Modified Successfully!',
        description: 'Welcome! Season Game Setting Updated!'
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Modification Failed',
        description: error?.message || 'Your action has been failed. Please try again!'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex w-full flex-wrap justify-center gap-x-3 gap-y-4">
        {promotionList?.map((game, index) => (
          <div
            className="w-100 relative inline-block text-center"
            key={game._id}
          >
            <Image
              src={game.imageurl}
              alt={game.name}
              width={130}
              height={130}
              className="hover:cursor-pointer hover:opacity-85"
            />
            <div className="h-8 pt-2">
              <Checkbox
                checked={game.isfavourite}
                onCheckedChange={(value) =>
                  handleCheckBox(value as boolean, index)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          handleClick={() => updateGameList()}
          className="w-[260px]"
          disabled={isUpdating}
        >
          OK
        </Button>
      </div>
    </div>
  );
};

export default SeasonGameList;
