'use client';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import IntroductionFooter from './introductionFooter';
import { usePathname } from 'next/navigation';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const pathName = usePathname();
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="h-full  p-4 md:px-8">{children}</div>
          {pathName.includes('/mypage') && <IntroductionFooter />}
        </ScrollArea>
      ) : (
        <>
          <div className="h-full  p-4 md:px-8">{children}</div>{' '}
          {pathName.includes('/mypage') && <IntroductionFooter />}
        </>
      )}
    </>
  );
}
