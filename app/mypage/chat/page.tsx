import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import { UserChatPage } from '@/sections/chat/views';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};

export const fetchCache = 'only-no-store'

export const dynamic = 'force-dynamic'



export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  return (
    <RoleMiddleware accessRight="user">
      <UserChatPage />
    </RoleMiddleware>
  );
}
