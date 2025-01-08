import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import Guide from '@/sections/promotion/promotion-guide';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Start Guide', link: '/mypage/start-guide' }
];

type TEmployeeListingPage = {};

export default async function StartGuidePage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false} />
        <Separator />
        <Guide/>
      </div>
    </PageContainer>
  );
}
