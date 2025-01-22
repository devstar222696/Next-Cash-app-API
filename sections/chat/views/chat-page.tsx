import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import UserChat from '../chat-fron';
import Image from 'next/image';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Our us', link: '/mypage/chat' }
];

type TEmployeeListingPage = {};

export default async function UserChatPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false} />
        <div className="flex justify-center">
          <Image
            src="/pageTitle/004.png"
            width={500}
            height={200}
            className="mt-1 hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="ourus"
          ></Image>
        </div>
        <UserChat />
      </div>
    </PageContainer>
  );
}
