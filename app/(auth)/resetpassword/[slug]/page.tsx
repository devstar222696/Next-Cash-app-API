import UserAuthResetPassword from '@/sections/resetPassword/user-auth-resetPassword';
import { Metadata } from 'next';

import React from 'react'

export const metadata: Metadata = {
    title: 'Island House',
    description: ''
  };


export default function Page() {
  return <UserAuthResetPassword />
}