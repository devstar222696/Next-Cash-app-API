import UserAuthForgotPassword from '@/sections/forgotpassword/user-auth-forgotpassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Island House',
  description: ''
};

export default function Page() {
  return <UserAuthForgotPassword />
}
