
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const BackToMypage = () => {
  const router = useRouter();

  const handleBackToMyPage = () => {
    router.push('/mypage/promotion');
  };

  return (
    <Image
      src="/btn/007.png"
      width={300}
      height={5}
      className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
      onClick={handleBackToMyPage}
      alt="backtohome"
    ></Image>
  );
};

export default BackToMypage;
