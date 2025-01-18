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
    const checkAuth = () => {
      try {
        const userInfoStr = localStorage.getItem('userinfo');
        if (!userInfoStr) {
          router.push('/');
          return;
        }

        const userInfo = JSON.parse(userInfoStr);
        if (userInfo.role === 'user' || userInfo.role === 'vip_user') {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
