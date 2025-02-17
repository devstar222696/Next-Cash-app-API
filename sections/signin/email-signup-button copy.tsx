'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function EmailSignInButton() {
  const router = useRouter();

  const handleForgotPwd = async () => {
    router.push('forgotpassword')
  }

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      handleClick={handleForgotPwd}
    >
      <Mail className="mr-2 h-4 w-4" />
      Forgot Password?
    </Button>
  );
}
