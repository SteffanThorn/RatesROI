import './globals.css';
import { auth } from '@/auth';
import Sidebar from '@/components/Sidebar';
import SuggestEditButton from '@/components/SuggestEditButton';

export const metadata = {
  title: {
    default: 'Fair Say NZ — Everyone gets a fair say.',
    template: '%s | Fair Say NZ',
  },
  description:
    'Fair Say NZ: 100% neutral, NZ-focused civic platform. News, party info, MP contacts, polls and real ways to have your say.',
  keywords: ['New Zealand', 'civics', 'parliament', 'election 2026', 'NZ politics', 'civic education'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Fair Say NZ',
    description: 'Fair Say NZ: 100% neutral, NZ-focused civic platform. News, party info, MP contacts, polls and real ways to have your say.',
    locale: 'en_NZ',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080f1e',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en-NZ">
      <body>
        <Sidebar session={session} />
        <div className="page-content min-h-screen">
          {children}
        </div>
        <SuggestEditButton />
      </body>
    </html>
  );
}
