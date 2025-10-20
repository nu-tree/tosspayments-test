'use client';
import { useTossPayments } from '@/hooks/custom/use-toss-payments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = React.HTMLAttributes<HTMLElement>;

/**
 * Toss Payments 결제 위젯 컴포넌트
 */
export const Payments = ({ className }: Readonly<Props>) => {
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: 50000,
  });

  const { isLoading, error, isReady, setAmount: updateAmount, renderPaymentWidget, renderAgreement, requestPayment } =
    useTossPayments({
      clientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_ID!,
      customerKey: 'utDvvoe_AthCNhAHlCMth',
    });

  useEffect(() => {
    if (isLoading) return;

    const renderWidgets = async () => {
      try {
        await updateAmount(amount);
        await Promise.all([
          renderPaymentWidget({ selector: '#payment-method' }),
          renderAgreement({ selector: '#agreement' }),
        ]);
      } catch (err) {
        console.error('위젯 렌더링 실패:', err);
      }
    };

    renderWidgets();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !isReady) return;
    updateAmount(amount).catch((err) => console.error('금액 업데이트 실패:', err));
  }, [amount, isLoading, isReady]);

  const handlePayment = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      await requestPayment({
        orderId: `order-${Date.now()}`,
        orderName: '토스 티셔츠 외 2건',
        successUrl: `${baseUrl}/tosspay-ments/success`,
        failUrl: `${baseUrl}/tosspay-ments/fail`,
        customerEmail: 'customer123@gmail.com',
        customerName: '김토스',
        customerMobilePhone: '01012341234',
      });
    } catch (err) {
      console.error('결제 실패:', err);
    }
  };

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertDescription>결제 위젯 로딩 중 오류가 발생했습니다.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div id="payment-method" className="mb-6"></div>
        <div id="agreement" className="mb-6"></div>
        <Button onClick={handlePayment} disabled={!isReady} className="w-full" size="lg">
          결제하기
        </Button>
      </Card>
    </div>
  );
};

