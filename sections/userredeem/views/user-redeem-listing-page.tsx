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
import Image from 'next/image';
import VIPTagId from '@/components/ui/VipTagId';
import { AdminRegisterUsers } from '@/constants/data';
import { Roles } from '@/constants/roles';

const breadcrumbItems = [
  { title: 'Mypage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' }
];

type TEmployeeListingPage = {};

export default function UserredeemListingPage({ }: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const [tagId, setTagId] = useState<AdminRegisterUsers | null>(null)
  console.log('tagId: ---->', tagId);
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false}/>

        {/* <div className="flex items-start justify-between">
          <Heading title={`Deposit`} description="" />
        </div>
        <Separator /> */}
        <div className="flex justify-center w-full">
        <img src="/IH_register_2.png" alt="recharge" />
        </div>
        <div className="grid justify-items-center">
          <Image src="/IHRechargeNotice.png" width={1000} height={1000} alt="ad" />
        </div>
        {tagId?.role === Roles.vip_user ? <VIPTagId  tagId={tagId?.tag}/>:   <TagId tagId={tagId?.tag || ''} /> }
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
