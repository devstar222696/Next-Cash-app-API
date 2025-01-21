import Image from 'next/image';
import React from 'react';

interface Props {
  src: string;
  className?: string;
}

const HeaderImg: React.FC<Props> = ({ src, className }) => {
  return (
    <div className={`flex justify-center ${className ? className : ''}`}>
      <Image
        src={src}
        width={500}
        height={200}
        className="mt-1 hover:opacity-80 lg:ml-2 lg:mt-0"
        alt="img"
      ></Image>
    </div>
  );
};

export default HeaderImg;
