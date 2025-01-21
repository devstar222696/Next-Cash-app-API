import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import USDTform from '../usdt-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'USDT', link: '/mypage/deposit/usdt' }
];

type TUSDTPageType = {};

export default async function USDTPage({}: TUSDTPageType) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`USDT`} description="" />
        </div>
        <Separator /> */}
        <USDTform />
      </div>
    </PageContainer>
  );
}
