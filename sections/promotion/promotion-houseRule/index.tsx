import React from 'react';

const houseRules = [
  'Your tag number is your ID. Please be sure to remember it.',
  'We do not ask for tips, and we do not accept also.',
  'Referral Bonus, Daily Bonus, and First Deposit Bonus can only be received when the User deposits more than $10.',
  'All bonuses are stackable and cannot be received in one time.',
  "Only users who have deposited more than $10 are considered 'Old Users'.",
  'The minimum deposit is $1, but we don’t accept cents. Dollars only.',
  'The minimum Cashout is $50, the maximum is $3,000, and if exceeded, User can apply again the next day.',
  'All daily bonuses reset at: 00:00 HST time, 02:00 PST time, and 04:00 CST time.'
];

const HouseRules = () => (
  <div className="mx-auto max-w-3xl rounded-lg  p-6 ">
    <h2 className="mb-6 text-center text-2xl font-semibold">House Rules</h2>
    <div className="rounded-lg  ">
      <ul className="space-y-4 text-sm sm:text-base md:text-lg">
        {houseRules.map((rule, index) => (
          <li key={index} className="text-sm ">
            <strong className="font-semibold">{rule}</strong>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default HouseRules;
