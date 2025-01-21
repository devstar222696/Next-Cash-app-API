import Image from 'next/image';
import React from 'react';

interface Props {
  src: string;
  className?: string;
  width?: number;
  onClick?: () => void;
}

const ButtonImg: React.FC<Props> = ({ src, className, width, onClick }) => {
  return (
    <Image
      src={src}
      width={width || 200}
      height={5}
      className={`mt-1 hover:opacity-80 lg:ml-2 lg:mt-0 ${
        className ? className : ''
      }`}
      onClick={onClick}
      alt="img"
    ></Image>
  );
};

export default ButtonImg;
