import type { Metadata } from 'next';
import './globals.css';
import { AdminDataProvider } from '@/context/AdminDataContext';
import { AdminLayout } from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Server Salad Cloud Services | Administration Portal',
  description:
    'Internal cloud hosting operations, server allocation, automated provisioning, billing and support administration platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f8f9fa] text-[#111827]" suppressHydrationWarning>
        <AdminDataProvider>
          <AdminLayout>{children}</AdminLayout>
        </AdminDataProvider>
      </body>
    </html>
  );
}
