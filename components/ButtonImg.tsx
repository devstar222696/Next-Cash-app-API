import Image from 'next/image';
import React from 'react';

interface Props {
  src: string;
  className?: string;
  width?: number;
}

const ButtonImg: React.FC<Props> = ({ src, className, width }) => {
  return (
    <Image
      src={src}
      width={width || 200}
      height={5}
      className={`mt-1 hover:opacity-80 lg:ml-2 lg:mt-0 ${
        className ? className : ''
      }`}
      alt="img"
    ></Image>
  );
};

export default ButtonImg;
