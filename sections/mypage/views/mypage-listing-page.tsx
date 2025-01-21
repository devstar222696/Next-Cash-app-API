import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import MyPageTable from '../mypage-tables';
import Image from 'next/image';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'LoginInfo', link: '/mypage/login info' }
];

type TEmployeeListingPage = {};

export default async function MyPageListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false} />

        {/* <div className="flex items-start justify-between">
          <Heading title={`Login Info`} description="" />
        </div>
        <Separator /> */}
        <div className='flex justify-center'>
          <Image
            src="/my-page.png"
            width={500}
            height={200}
            className="mt-1 hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="house rule"
          ></Image>
        </div>
        <MyPageTable />
      </div>
    </PageContainer>
  );
}
