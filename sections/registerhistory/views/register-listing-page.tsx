import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminRegisterHistoryTable from '../register-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Register', link: '/main/register' },
  { title: 'Register History', link: '/main/register/registerhistory' }
];

type TEmployeeListingPage = {};

export default async function RegisterHistoryListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Register History`} description="" />
        </div>
        <Separator />
        <AdminRegisterHistoryTable />
      </div>
    </PageContainer>
  );
}
