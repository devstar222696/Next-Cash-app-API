/* eslint-disable @next/next/no-img-element */
'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Slider from "react-slick";

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

const sliderSettings = {
  dots: true,
  infinite: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  adaptiveHeight: false,
  // appendDots: true,
  speed: 2000,
  autoplaySpeed: 2500,
  cssEase: "linear",
  appendDots: (dots: any) => (
    <div
      className='p-0 m-0 text-black dark:text-white'
    >
      <ul style={{ margin: "0px" }}> {dots} </ul>
    </div>)
}

const posterImages = [
  "/promo/main_poster_1.png",
  "/promo/main_poster_2.png",
  "/promo/main_poster_3.png",
  "/promo/main_poster_4.png",
  "/promo/main_poster_5.png",

]
export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  const router = useRouter();
  const pathName = usePathname();

  const chatting = () => {
    router.push('/mypage/chat');
  };

  return (
    <Breadcrumb>
      {userInfo.role === "user" ?
        <div>
          {pathName === '/mypage/promotion' ? <Slider {...sliderSettings} className='grid mb-10'>
            {posterImages.map((img, index) => <img src={img} key={img} width={1000} height={500} className="w-full promo-image" alt="cover" />)}
          </Slider> : <Image src="/promo/web-cover.png" width={1000} height={500} className="mb-10 w-full" alt="cover" />}

          <Image
            src="/chat-image.png"
            width={70}
            height={70}
            alt="chatting"
            className="absolute right-5 bottom-[5px] sm:bottom-[10Fpx] z-50 cursor-pointer hover:scale-105 sm:right-14"
            onClick={chatting}
          />
        </div>
        : ""
      }
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
