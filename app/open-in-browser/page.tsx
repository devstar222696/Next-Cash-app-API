import OpenInBrowserPage from '@/sections/open-in-browser';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Island House',
  description: ''
};

export default function Page() {
  return <OpenInBrowserPage />;
}
