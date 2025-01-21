'use client';
import Image from 'next/image';
import { GameLink } from './game-link';
import { useRouter } from 'next/navigation';
import TagId from '@/components/ui/tagId';
import VIPTagId from '@/components/ui/VipTagId';
import { Roles } from '@/constants/roles';
import BackToMypage from '@/components/BackToMypage';
import ButtonImg from '@/components/ButtonImg';

export default function PromotionPage({ tagData }: any) {
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

  const houseRule = () => {
    router.push('/mypage/house-rules');
  };

  const facebook = () => {
    router.push(
      'https://www.facebook.com/profile.php?id=61564819906157&mibextid=ZbWKwL'
    );
  };

  const instagram = () => {
    router.push('https://www.instagram.com/islandhouse2000/');
  };

  const ourUs = () => {
    router.push('/mypage/chat');
  };

  const guide = () => {
    router.push('/mypage/guide');
  };
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-center">
          <ButtonImg
            src="/btn/IH Start Guide.png"
            width={350}
            onClick={guide}
          />
        </div>
        {tagData?.role === Roles.vip_user ? (
          <VIPTagId tagId={tagData?.tag} />
        ) : (
          <TagId tagId={tagData?.tag} />
        )}
      </div>
      {/* <div className="grid justify-items-center">
        <Image src="/promo/promo1.png" width={1000} height={1000} alt="ad" />
      </div> */}
      {/* <div className="grid justify-items-center">
        <Image src="/promo/promo2.png" width={1000} height={1000} alt="ad" />
      </div> */}
      <div className="grid w-full grid-cols-1 place-items-center">
        <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Image
            src="/btn/001.png"
            width={300}
            height={5}
            className="pt-[3px] hover:cursor-pointer hover:opacity-80"
            onClick={register}
            alt="register"
          ></Image>
          <Image
            src="/btn/002.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={recharge}
            alt="recharge"
          ></Image>
          <Image
            src="/btn/003.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={redeem}
            alt="redeem"
          ></Image>
          <BackToMypage className="h-full" width={300} />
          <Image
            src="/btn/006.png"
            width={300}
            height={5}
            className="mt-1 h-full hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="houserule"
            onClick={houseRule}
          ></Image>
          <Image
            src="/btn/005.png"
            width={300}
            height={5}
            className="mt-1 h-full hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="our us"
            onClick={ourUs}
          ></Image>
        </div>
      </div>
      <div className="w-full">
        <p className="text-md mt-5 text-center font-bold">
          Welcome to ISLAND HOUSE!
        </p>
        <p className="text-md text-center font-bold">
          Click image to download link
        </p>
      </div>
      <GameLink />
    </>
  );
}
