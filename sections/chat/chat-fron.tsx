'use client';

import BackToHomeBtn from '@/components/BackToHomeBtn';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserChat() {
  const router = useRouter();

  const facebook = () => {
    router.push(
      'https://www.facebook.com/profile.php?id=61564819906157&mibextid=ZbWKwL'
    );
  };

  const instagram = () => {
    router.push('https://www.instagram.com/islandhouse2000/');
  };

  const goback = () => {
    router.push('/mypage');
  };

  return (
    <div>
      <p className="mx-8 mt-2 text-left text-sm sm:text-center">
        Personal Chat features are coming soon!
        <br />
        For now, please use the following apps for our current chat system.
        Thank you for your understanding and support!
      </p>
      {/* <div className="mt-10 w-full rounded-xl border border-4 border-solid border-gray-200 bg-blue-400 p-3">
        <p className="mt-2 text-center text-sm font-semibold text-white ">
          Sorry, chat function will be added soon! Until then, please use
          Instagram and Facebook🙂
        </p>
      </div> */}
      <div className="lg:evenly mt-10 flex justify-evenly">
        <Image
          src="/facebook.png"
          width={100}
          height={100}
          className="hover:cursor-pointer hover:opacity-80"
          onClick={facebook}
          alt="facebook"
        ></Image>
        <Image
          src="/Instagram.png"
          width={100}
          height={100}
          className="hover:cursor-pointer hover:opacity-80"
          onClick={instagram}
          alt="instagram"
        ></Image>
      </div>

      <div className='flex items-center justify-center mt-5'>
        <Image
          src="/social/001.png"
          width={60}
          height={60}
          className="hover:cursor-pointer hover:opacity-80"
          alt="telegram"
        ></Image>
        <Image
          src="/social/002.png"
          width={60}
          height={60}
          className="hover:cursor-pointer hover:opacity-80"
          alt="whatsapp"
        ></Image>
        <p className='font-extrabold text-2xl'>+1 (808) 479-8908</p>
      </div>
      <div className="mt-3 flex justify-center">
        <BackToHomeBtn />
      </div>
    </div>
  );
}
