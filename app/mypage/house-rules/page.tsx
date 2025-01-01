import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import HouseRulesPage from '@/sections/house-rules/views/house-rules-page';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};





export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  return (
    <RoleMiddleware accessRight="user">
      <HouseRulesPage />
    </RoleMiddleware>
  );
}
