import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import { UserPaypalPage } from '@/sections/paypal/views';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};

export const fetchCache = 'only-no-store'



export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <RoleMiddleware accessRight="user">
      <UserPaypalPage />
    </RoleMiddleware>
  );
}
