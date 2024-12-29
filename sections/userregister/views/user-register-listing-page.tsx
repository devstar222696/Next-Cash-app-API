import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserRegisterTable from '../register-tables';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Register', link: '/mypage/register' }
];

type TEmployeeListingPage = {};

export default async function UserRegisterListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        {/* 헤딩 영역 */}
        <div className="flex items-start justify-between">
          <Heading title={`Register`} description="" />
        </div>

        {/* 안내문 영역 */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            We cannot process register requests for two days. We will fix it as soon as possible.
          </p>
        </div>

        <Separator />

        {/* 테이블 영역 */}
        <UserRegisterTable />
      </div>
    </PageContainer>
  );
}