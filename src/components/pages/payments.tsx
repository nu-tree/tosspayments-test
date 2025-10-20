'use client';
import { cn } from '@/lib/utils';
import { useTossPayments } from '@/hooks/custom/use-toss-payments';
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

  // 훅 초기화
  const { isLoading, error, isReady, setAmount: updateAmount, renderPaymentWidget, renderAgreement, requestPayment } =
    useTossPayments({
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      customerKey: 'utDvvoe_AthCNhAHlCMth',
    });

  // 위젯 렌더링 (금액 설정 후)
  useEffect(() => {
    if (isLoading) return;

    const renderWidgets = async () => {
      try {
        // 결제 금액 설정
        await updateAmount(amount);

        // 결제 UI와 약관 UI 동시 렌더링
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

  // ============================================================
  // 금액 변경 시 업데이트
  // ============================================================
  useEffect(() => {
    if (isLoading || !isReady) return;

    updateAmount(amount).catch((err) => {
      console.error('금액 업데이트 실패:', err);
    });
  }, [amount, isLoading, isReady]);


  const handlePayment = async () => {
    try {
      await requestPayment({
        orderId: `order-${Date.now()}`,
        orderName: '토스 티셔츠 외 2건',
        successUrl: `${window.location.origin}/tosspay-ments/success`,
        failUrl: `${window.location.origin}/tosspay-ments/fail`,
        customerEmail: 'customer123@gmail.com',
        customerName: '김토스',
        customerMobilePhone: '01012341234',
      });
    } catch (err) {
      console.error('결제 실패:', err);
    }
  };

  if (error) {
    return <div className={cn('text-red-500', className)}>결제 위젯 로딩 중 오류가 발생했습니다.</div>;
  }

  if (isLoading) {
    return <div className={cn('', className)}>로딩 중...</div>;
  }

  return (
    <div className={cn('', className)}>
      {/* 결제 위젯 렌더링 영역 */}
      <div id="payment-method"></div>

      {/* 이용약관 렌더링 영역 */}
      <div id="agreement"></div>

      {/* 결제하기 버튼 */}
      <div className="mt-4">
        <button
          onClick={handlePayment}
          disabled={!isReady}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

