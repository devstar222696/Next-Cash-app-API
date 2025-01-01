import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import HouseRules from '@/sections/promotion/promotion-houseRule';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'House Rules', link: '/mypage/house-rules' }
];

type TEmployeeListingPage = {};

export default async function HouseRulesPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false} />
        {/* <div className="flex items-start justify-between">
          <Heading title={`House Rules`} description="" />
        </div> */}
        <Separator />
        <HouseRules/>
      </div>
    </PageContainer>
  );
}
