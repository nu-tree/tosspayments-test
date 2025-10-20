'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 결제 성공 컴포넌트
 */
export const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const paymentKey = searchParams.get('paymentKey');

  useEffect(() => {
    if (!orderId || !amount || !paymentKey) {
      setError('결제 정보가 올바르지 않습니다.');
      setIsConfirming(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount, paymentKey }),
        });

        const result = await response.json();

        if (!response.ok) {
          router.push(`/tosspay-ments/fail?message=${result.message}&code=${result.code}`);
          return;
        }

        console.log('결제 승인 완료:', result);
        setIsConfirming(false);
      } catch (err) {
        console.error('결제 승인 중 오류:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [orderId, amount, paymentKey, router]);

  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">오류 발생</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/tosspay-ments')} className="mt-6 w-full" variant="secondary">
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isConfirming) {
    return (
      <section className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <h2 className="mb-2 text-xl font-bold">결제 승인 중...</h2>
            <p className="text-muted-foreground">잠시만 기다려주세요.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">결제 성공</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">주문번호</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">결제 금액</span>
              <span className="font-medium">{Number(amount).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">결제 키</span>
              <span className="truncate font-mono text-xs">{paymentKey}</span>
            </div>
          </div>
          <Button onClick={() => router.push('/tosspay-ments')} className="mt-6 w-full" size="lg">
            확인
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

