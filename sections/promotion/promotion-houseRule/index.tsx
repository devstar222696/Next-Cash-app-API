'use client'

import Image from 'next/image';
import React from 'react';
import BackToHomeBtn from '@/components/BackToHomeBtn';

const houseRules = [
  'Withdrawal Rule',
  'Your tag number is like a your ID. Please be sure to remember it.',
  'When making a deposit, Player must include your Tag Number in the Payment App Note to ensure a quick recharge.',
  '100% Match BONUS and 20% Daily BONUS are only available to players who have made deposits of $10 or more.',
  'Free Players who have not made deposits of $10 or more must have a spin record of over $100 per game account to make a redeem request. Additionally, only up to $100 can be redeemed per day.',
  'Players who deposit $10 or more in a week will be upgraded to VIP status. The status resets every Monday.',
  'When a player you referred makes their first deposit of $10 or more, you will receive 50% of that amount as a bonus.',
  'All BONUS cannot be claimed at once. Only one bonus can be received per recharge.',
  'Redeem request requires a minimum number of spins equal to the deposit amount.',
  'Daily BONUS reset at 00:00 HST time, 02:00 PST time, and 04:00 CST time.',
  "All deposit and withdrawal history is kept for up to 2 weeks. This is the game company's recommendation.",
  'The Daily maximum Cashout is $3,000, and if it is exceeded, User can apply again the next day.',
  "The minimum deposit is $1, but we don't accept cents Dollars Only.",
  'We do not ask for tips, and we do not accept also.',
  'ISLAND HOUSE strictly prohibits users from creating duplicate accounts. We hold no responsibility for any damages or issues arising from the detection of duplicate accounts.'
];

const HouseRules = () => (
  <div className="mx-auto max-w-3xl rounded-lg  p-6 ">
    {/* <h2 className="mb-6 text-center text-2xl font-semibold">House Rules</h2>  */}
    <div className="mb-4 flex justify-center">
      <Image
        src="/IH house rule title.png"
        width={500}
        height={200}
        className="mt-1 hover:opacity-80 lg:ml-2 lg:mt-0"
        alt="house rule"
      ></Image>
    </div>
    <div className="rounded-lg  ">
      <ul className="space-y-4 text-sm sm:text-base md:text-lg">
        {houseRules.map((rule, index) => (
          <li key={index} className="text-sm ">
            <strong className="font-semibold">{rule}</strong>
          </li>
        ))}
      </ul>
    </div>
    <div className='mt-3'>
      <BackToHomeBtn className='m-auto' />
    </div>
  </div>
);

export default HouseRules;
