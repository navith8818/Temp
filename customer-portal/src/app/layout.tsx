import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AccountProvider } from '@/context/AccountContext';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';

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
      <body className="h-full overflow-hidden flex flex-row bg-[#f8f9fa] text-[#111827]">
        <ToastProvider>
          <AccountProvider>
            {/* Global Left Side Icon Bar with Hover Expansion */}
            <Sidebar />

            {/* Main Application Area */}
            <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
              <Navbar />
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">{children}</div>
            </div>
          </AccountProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
