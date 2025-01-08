/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { GamePromotionItem } from '@/types';

const sliderSettings = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  autoplay: true,
  adaptiveHeight: false,
  // appendDots: true,
  speed: 500,
  autoplaySpeed: 3000,
  cssEase: "linear",
}

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export const GameLink = () => {
  const [promotionList, setPromotionList] = useState<GamePromotionItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/seasongame', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}` // Assuming the token is sent this way
          },
          cache: 'no-store'
        });
        const result = await response.json();
        setPromotionList(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const openGame = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="flex w-full overflow-x-auto lg:justify-center">
      <Slider {...sliderSettings} className="grid w-full">
        {promotionList?.map((game) => (
          <div className="w-100 relative inline-block" key={game._id}>
            <img
              src={game.imageurl}
              alt={game.name}
              className="isFav hover:cursor-pointer hover:opacity-85"
              onClick={() => openGame(game.url)}
              loading="lazy"
            />
            {game.isfavourite && (
              <img
                src="/star-3d.png"
                className="absolute left-0 top-0 size-[30%]"
                alt="star"
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};
