'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserredeemForm from '../user-redeem-tables/user-redeem-fron';
import UserredeemTable from '../user-redeem-tables';
import TagId from '@/components/ui/tagId';
import { useState } from 'react';
import { GameLink } from '@/sections/promotion/promotion-tables/game-link';

const breadcrumbItems = [
  { title: 'Mypage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' }
];

type TEmployeeListingPage = {};

export default function UserredeemListingPage({ }: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const [tagId, setTagId] = useState('')
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Deposit`} description="" />
        </div>
        <Separator />
        <TagId tagId={tagId} />
        <UserredeemForm setTagId={setTagId} />
        <p className="text-medium py-5 text-center font-bold">
          Deposit History
        </p>
        <UserredeemTable />
        <GameLink />
      </div>
    </PageContainer>
  );
}
