import React from 'react';
import Image from 'next/image';

const IntroductionFooter = () => {

  return (
    <>
      <footer className="h-fit w-full bg-[#BABABA] p-6 text-black">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <span className="font-semibold">Follow Us</span>
              <div className="flex gap-2">
                <Image
                  src="/facebook.png"
                  width={24}
                  height={18}
                  alt="ad"
                  className=""
                />
                <Image
                  src="/instagram.png"
                  width={24}
                  height={18}
                  alt="ad"
                  className=""
                />
              </div>
            </div>
            <p className="text-sm font-medium">
              Island House. All Rights Reserved.
            </p>
            <Image src="/IH Title.png" width={120} height={120} alt="ad" />
            <div className="flex gap-0">
              <Image src="/Visa.png" width={26} height={26} alt="Visa" />
              <Image src="/Dollar.png" width={26} height={26} alt="Dollar" />
              <Image src="/Zelle.png" width={26} height={26} alt="Zelle" />
              <Image src="/Bitcoins.png" width={26} height={26} alt="Bitcoin" />
              <Image src="/PayPal.png" width={26} height={26} alt="PayPal" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default IntroductionFooter;
