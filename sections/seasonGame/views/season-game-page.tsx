import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import SeasonGameList from './SeasonGameList';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Session Game', link: '/main/sessiongame' }
];

type SeasonGamePage = {};

export default async function RegisterListingPage({}: SeasonGamePage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Season Game Setting`} description="" />
        </div>
        <Separator />
        <SeasonGameList />
      </div>
    </PageContainer>
  );
}
