import PageContainer from '@/components/layout/page-container';
import Tronform from '../tron-fron';

type TTronPageType = {};

export default async function USDTPage({}: TTronPageType) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Tronform />
      </div>
    </PageContainer>
  );
}
