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
                 <Image
                  src="/social/001.png"
                  width={24}
                  height={18}
                  alt="ad"
                  className=""
                />
                 <Image
                  src="/social/002.png"
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
            {/* <Image src="/IH Title.png" width={160} height={160} alt="ad" /> */}
            <Image src="/IH-LOGO.png" width={170} height={170} alt="logo image" />

            <div className="mt-3 flex gap-0">
              <Image src="/Dollar.png" width={36} height={36} alt="Dollar" />
              <Image src="/Visa.png" width={36} height={36} alt="Visa" />
              <Image src="/PayPal.png" width={36} height={36} alt="PayPal" />
              <Image src="/Bitcoins.png" width={34} height={36} alt="Bitcoin" />
              <Image src="/payment/TR.png" width={34} height={36} alt="TR" />
              <Image src="/payment/ETH.png" width={34} height={36} alt="ETH" />
              <Image src="/usdt.png" width={36} height={36} alt="USDT" /> 
              {/* <Image src="/Zelle.png" width={36} height={36} alt="Zelle" /> */}
              <Image src="/payment/USDC.png" width={36} height={36} alt="USDC" /> 
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default IntroductionFooter;
