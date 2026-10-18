import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AccountProvider } from '@/context/AccountContext';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Server Salad | Customer Cloud Hosting Portal',
  description:
    'Manage your cloud hosting instances, websites, domain allocations, and HestiaCP control panel integrations with Server Salad Cloud Services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full overflow-hidden flex flex-col bg-[#f8f9fa] text-[#111827]">
        <ToastProvider>
          <AccountProvider>
            <Navbar />
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">{children}</div>
          </AccountProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
