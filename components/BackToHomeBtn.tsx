import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const BackToHomeBtn = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/mypage');
  };

  return (
    <Image
      src="/btn/008.png"
      width={300}
      height={5}
      className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
      onClick={handleBackToHome}
      alt="backtohome"
    ></Image>
  );
};

export default BackToHomeBtn;
