import Image from 'next/image';
import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  width?: number
}

const BackToMypage: FC<Props> = ({ className, width }) => {
  const router = useRouter();

  const handleBackToMyPage = () => {
    router.push('/mypage/promotion');
  };

  return (
    <Image
      src="/btn/007.png"
      width={width || 200}
      height={5}
      className={`mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0 ${
        className || ''
      }`}
      onClick={handleBackToMyPage}
      alt="backtomypage"
    ></Image>
  );
};

export default BackToMypage;
