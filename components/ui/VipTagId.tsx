import useDarkMode from "@/hooks/use-dark-mode";
import { useTheme } from "next-themes";
import Image from "next/image";


interface ITagIdProps {
  tagId: string | number;
}

const VIPTagId = ({ tagId }: ITagIdProps) => {
  const isDarkMode = useDarkMode();
  
  const imageSrc = isDarkMode ? "/vip_tag_number_dark.png" : "/white-vip-tag.png";

  return (
    <div className="flex items-center justify-center">
      <div className="relative rounded-md w-[300px] h-[90px]">
        <div className="absolute rounded-md"> <Image src={imageSrc} width={300} height={300} alt="white-vip-tag" /></div>
        <div className="relative flex items-center rounded-md justify-center w-[300px] h-[90px] gap-2 ">
          <span className="text-4xl b-[0px] w-[44px]">🔥</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            VIP #{tagId}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default VIPTagId;
