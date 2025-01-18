import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Main Starter',
  description: 'Basic main with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

  useEffect(() => {
    if (Object.keys(userInfo).length === 0 || userInfo.role === 'user' || userInfo.role === 'vip_user') {
      router.push('/');
    }
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
