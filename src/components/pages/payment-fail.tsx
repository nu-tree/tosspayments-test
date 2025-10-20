'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

/**
 * 결제 실패 컴포넌트
 */
export const PaymentFail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get('code') || '알 수 없는 오류';
  const errorMessage = searchParams.get('message') || '결제에 실패했습니다.';

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive">결제 실패</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle className="text-sm font-mono">{errorCode}</AlertTitle>
            <AlertDescription className="mt-2">{errorMessage}</AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-2">
            <Button onClick={() => router.push('/tosspay-ments')} variant="secondary" className="flex-1">
              다시 시도
            </Button>
            <Button onClick={() => router.push('/')} className="flex-1">
              홈으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

