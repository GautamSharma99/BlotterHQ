import type { Metadata } from 'next';
import './globals.css';
import { MockDataProvider } from '@/lib/mock-context';

export const metadata: Metadata = {
  title: 'BlotterHQ — SEC Reg S-P Cybersecurity Incident Blotter',
  description: 'Automated cybersecurity incident blotter compliance for SEC-registered investment advisors. Forward, classify, confirm, comply.',
  keywords: ['SEC', 'Reg S-P', 'cybersecurity', 'incident blotter', 'compliance', 'RIA'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#07070d" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <MockDataProvider>
          {children}
        </MockDataProvider>
      </body>
    </html>
  );
}
