import React from 'react';
import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import { SeasonGamePage } from '@/sections/seasonGame/views';
import { SearchParams } from 'nuqs/parsers';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <RoleMiddleware accessRight="admin">
      <SeasonGamePage />
    </RoleMiddleware>
  );
}
