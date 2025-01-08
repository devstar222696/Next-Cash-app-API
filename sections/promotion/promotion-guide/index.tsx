import Image from 'next/image';
import React from 'react';

const Guide = () => (
  <div className="w-full">
    <div className="mb-6 flex items-center justify-center">
      <Image
        src="/start-guide.png"
        width={350}
        height={5}
        className="pt-[2px]"
        alt="start guide"
      />
    </div>
    <div className="grid w-full place-items-center">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-2 lg:gap-4">
        <Image
          src="/my-page/IH guide 1.png"
          width={500}
          height={5}
          alt="guide"
        />
        <Image
          src="/my-page/IH guide 2.png"
          width={500}
          height={5}
          alt="guide"
        />
        <Image
          src="/my-page/IH guide 3.png"
          width={500}
          height={5}
          alt="guide"
        />
        <Image
          src="/my-page/IH guide 4.png"
          width={500}
          height={5}
          alt="guide"
        />
      </div>
    </div>
  </div>
);

export default Guide;
