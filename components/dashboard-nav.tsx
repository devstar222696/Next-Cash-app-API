'use client';

import { Icons } from '@/components/icons';
import { useBreakpoint } from '@/hooks/useBreakPoints';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import useSocket from '@/lib/socket';
import { useSidebarCounts } from './layout/sidebar-context';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

const NavItemContent = React.memo(
  ({
    item,
    isMinimized,
    path
  }: {
    item: NavItem;
    isMinimized: boolean;
    path: string;
  }) => {
    const Icon = item.icon ? Icons[item.icon] : Icons.logo;
    const hasChildren = item.children && item.children.length > 0;

    // const [registerR, setRegisterR] = useState(0);
    const [verifyR, setVerifyR] = useState(0);
    // const [redeemR, setDepositR] = useState(0);
    // const [withdrawalR, setWithdrawalR] = useState(0);
    const counts = useSidebarCounts()
    // const { socket } = useSocket();

    // socket?.on('registerRecieve', (data: any) => {
    //   setRegisterR(data);
    // });

    // socket?.on('verifyRecieve', (data: any) => {
    //   setVerifyR(data);
    // });

    // socket?.on('depositRecieve', (data: any) => {
    //   setDepositR(data);
    // });

    // socket?.on('withdrawalRecieve', (data: any) => {
    //   setWithdrawalR(data);
    // });

    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
          path === item.href ? 'bg-accent' : 'transparent',
          item.disabled && 'cursor-not-allowed opacity-80'
        )}
      >
        <Icon className="size-5 flex-none" />
        {!isMinimized && <span className="mr-2 truncate">{item.title}</span>}
        {counts.register !== 0 && (
          <p className="w-5 rounded-full bg-red-500 text-center text-white">
            {item.title === 'Register' ? counts.register : ''}
          </p>
        )}
        {counts.redeem !== 0 && (
          <p className="w-5 rounded-full bg-red-500 text-center text-white">
            {item.title === 'Deposit' ? counts.redeem : ''}
          </p>
        )}
        {counts.withdrawal !== 0 && (
          <p className="w-5 rounded-full bg-red-500 text-center text-white">
            {item.title === 'Withdrawal' ? counts.withdrawal : ''}
          </p>
        )}
      </div>
    );
  }
);

NavItemContent.displayName = 'NavItemContent';

const NavItemLink = React.memo(
  ({
    item,
    children,
    handleClick
  }: {
    item: NavItem;
    children: React.ReactNode;
    handleClick: () => void;
  }) => (
    <Link
      href={item.disabled ? '/' : item.href || '#'}
      className={cn('block', item.disabled && 'cursor-not-allowed opacity-80')}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
);

NavItemLink.displayName = 'NavItemLink';

const NavItemButton = React.memo(
  ({
    onClick,
    children
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button className="w-full text-left" onClick={onClick}>
      {children}
    </button>
  )
);

NavItemButton.displayName = 'NavItemButton';

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { isAboveLg } = useBreakpoint('lg');

  const toggleExpand = useCallback((title: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const closeSidebar = useCallback(() => {
    if (isMobileNav) {
      setOpen?.(false);
    }
  }, [isMobileNav, setOpen]);

  const renderNavItem = useCallback(
    (item: NavItem, depth = 0) => {
      const hasChildren = item.children && item.children.length > 0;

      const content = (
        <NavItemContent
          item={item}
          isMinimized={isMinimized}
          path={path}
        />
      );

      if (hasChildren && isAboveLg && isMinimized) {
        return (
          <DropdownMenu key={item.title}>
            <DropdownMenuTrigger>{content}</DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 space-y-1"
              align="start"
              side="right"
              sideOffset={20}
            >
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
              {item.children &&
                item.children.map((child) => (
                  <DropdownMenuItem key={child.title} asChild>
                    {child.href && (
                      <Link
                        href={child.href}
                        className="cursor-pointer"
                        onClick={closeSidebar}
                      >
                        {child.title}
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }

      return (
        <div key={item.title}>
          {item.href ? (
            <NavItemLink item={item}
            handleClick={closeSidebar}>
              {content}
            </NavItemLink>
          ) : (
            <NavItemButton onClick={() => toggleExpand(item.title)}>
              {content}
            </NavItemButton>
          )}
          {hasChildren && !isMinimized && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children &&
                item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    },
    [expandedItems, isMinimized, isAboveLg, path, toggleExpand]
  );

  const memoizedItems = useMemo(() => items, [items]);

  if (!memoizedItems?.length) {
    return null;
  }

  return (
    <nav className={cn('grid items-start gap-2')}>
      <TooltipProvider>
        {memoizedItems.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>{renderNavItem(item)}</TooltipTrigger>
            <TooltipContent
              align="center"
              side="right"
              sideOffset={8}
              className={!isMinimized ? 'hidden' : 'inline-block'}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </nav>
  );
}
