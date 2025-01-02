'use client';

import React from 'react';
import NotFound from '@/app/not-found';
import { AccessRight, RolesByAccessRight } from '@/constants/roles';

export default function RoleMiddleware({
  children,
  accessRight
}: {
  children: React.ReactNode;
  accessRight: string;
}) {
  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
  const rolesByAccessRight = RolesByAccessRight[accessRight as AccessRight];
  if (rolesByAccessRight.includes(userInfo.role) || !userInfo.role) {
    return (<div>
      {children}</div>);
  } else {
    return <NotFound />;
  };
}
