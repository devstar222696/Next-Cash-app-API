import React from 'react';
import Image from 'next/image';

const IntroductionFooter = () => {
  return (
    <>
      <footer className="h-fit w-full bg-[#BABABA] p-6 text-black">
        <div className="flex flex-col">
          <div className="flex flex-col ">
            <div className="flex gap-3">
              <span className="font-semibold">Follow Us</span>
              <div className="flex gap-2">
                <Image
                  src="/Instagram.png"
                  width={24}
                  height={18}
                  alt="ad"
                  className=""
                />
                <Image
                  src="/facebook.png"
                  width={24}
                  height={18}
                  alt="ad"
                  className=""
                />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium">
             2024 - 2025 Island House. All Rights Reserved.
            </p>
            <Image src="/IH Title.png" width={160} height={160} alt="ad" />
            <div className="mt-3 flex gap-0">
              <Image src="/Visa.png" width={36} height={36} alt="Visa" />
              <Image src="/Dollar.png" width={36} height={36} alt="Dollar" />
              <Image src="/Zelle.png" width={36} height={36} alt="Zelle" />
              <Image src="/Bitcoins.png" width={34} height={36} alt="Bitcoin" />
              <Image src="/PayPal.png" width={36} height={36} alt="PayPal" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default IntroductionFooter;
