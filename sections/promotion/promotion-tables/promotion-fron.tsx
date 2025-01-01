'use client';
import Image from 'next/image';
import { GameLink } from './game-link';
import { useRouter } from 'next/navigation';
import TagId from '@/components/ui/tagId';

export default function PromotionPage({ tag }: any) {
  const router = useRouter();

  const register = () => {
    router.push('/mypage/register');
  };

  const recharge = () => {
    router.push('/mypage/deposit');
  };

  const redeem = () => {
    router.push('/mypage/withdrawal');
  };

  const facebook = () => {
    router.push(
      'https://www.facebook.com/profile.php?id=61564819906157&mibextid=ZbWKwL'
    );
  };

  const instagram = () => {
    router.push('https://www.instagram.com/islandhouse2000/');
  };
  return (
    <>
      <div className="w-full">
        <TagId tagId={tag} />
        <p className="text-md mt-5 text-center font-bold">
          Welcome to ISLAND HOUSE!
        </p>
        <p className="text-md text-center font-bold">
          Click image to download link
        </p>
      </div>
      <GameLink />
      <div className="grid justify-items-center">
        <Image src="/promo/promo1.png" width={1000} height={1000} alt="ad" />
      </div>
      {/* <div className="grid justify-items-center">
        <Image src="/promo/promo2.png" width={1000} height={1000} alt="ad" />
      </div> */}
      <div className="grid w-full grid-cols-1 place-items-center">
        <div className="grid grid-cols-2 gap-2 justify-items-center lg:flex lg:justify-center">
          <Image
            src="/my-page/button_1.png"
            width={300}
            height={5}
            className="hover:cursor-pointer hover:opacity-80"
            onClick={register}
            alt="register"
          ></Image>
          <Image
            src="/my-page/button_2.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={recharge}
            alt="recharge"
          ></Image>
          <Image
            src="/my-page/button_3.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={redeem}
            alt="redeem"
          ></Image>
          <Image
            src="/my-page/button_4.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="redeem"
          ></Image>
        </div>
        <div className="mt-3 flex justify-evenly lg:justify-center">
          <Image
            src="/facebook.png"
            width={50}
            height={50}
            className="hover:cursor-pointer hover:opacity-80"
            onClick={facebook}
            alt="facebook"
          ></Image>
          <Image
            src="/Instagram.png"
            width={50}
            height={50}
            className="ml-5 hover:cursor-pointer hover:opacity-80"
            onClick={instagram}
            alt="instagram"
          ></Image>
        </div>
      </div>
    </>
  );
}
