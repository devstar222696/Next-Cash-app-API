import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserPromotionTable from '../promotion-tables';
import HouseRules from '../promotion-houseRule';

const breadcrumbItems = [{ title: 'Main', link: '/mypage' }];

type TEmployeeListingPage = {};

export default async function Promotion({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} showBreadcrumbs={false} />
        {/*<div className="flex items-start justify-between">
          <Heading title={`Promotion`} description="" />
        </div> */}
        <Separator />
        <UserPromotionTable />
      </div>
    </PageContainer>
  );
}
