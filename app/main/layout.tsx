"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 1) 서버 환경이면 함수 실행 중단
    if (typeof window === 'undefined') return;
  
    try {
      const userInfoStr = localStorage.getItem('userinfo');
      if (!userInfoStr) {
        router.push('/');
        return;
      }
  
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo.role !== 'admin' && userInfo.role !== 'sub_admin') {
        router.push('/');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/');
    }
  }, [router]);

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden">
          <Header />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
