import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cn } from '@/lib/utils';
import { TanstackQueryProvider } from '@/lib/setting/tanstack-query/provider';
import { notoSansKr } from '@/config/font';
import { DesignedAlert } from '@/components/custom-ui/designed-alert/designed-alert';
import { DesignedConfirm } from '@/components/custom-ui/designed-confirm/designed-confirm';
import { Toaster } from '@/components/ui/sonner';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <TanstackQueryProvider>
        <body className={cn(`min-h-screen tracking-[-0.04rem] antialiased`, notoSansKr.className)}>
          <NuqsAdapter>{children}</NuqsAdapter>
          <DesignedAlert />
          <DesignedConfirm />
          <Toaster />
        </body>
      </TanstackQueryProvider>
    </html>
  );
}
