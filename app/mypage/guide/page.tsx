import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import StartGuidePage from '@/sections/start-guide/views/start-guide-page';
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
      <StartGuidePage />
    </RoleMiddleware>
  );
}
