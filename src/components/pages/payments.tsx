'use client';
import { cn } from '@/lib/utils';
import { useTossPayments } from '@/hooks/custom/use-toss-payments';

type Props = React.HTMLAttributes<HTMLElement>;

/**
 * Toss Payments 결제 위젯 컴포넌트
 */
export const Payments = ({ className }: Readonly<Props>) => {
  // ============================================================
  // 훅 초기화
  // ============================================================
  const { isLoading, error, isReady, renderPaymentWidget, requestPayment, getSelectedPaymentMethod } =
    useTossPayments({
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      customerKey: '1234567890',
      amount: 10000,
    });

  // ============================================================
  // 이벤트 핸들러: 결제 요청
  // ============================================================
  const handlePayment = async () => {
    try {
      await requestPayment({
        orderId: `order-${Date.now()}`,
        orderName: '테스트 상품',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 실패:', err);
      alert('결제에 실패했습니다.');
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
      <div id="payment-method-widget"></div>

      <button onClick={() => renderPaymentWidget({ selector: '#payment-method-widget' })}>결제 위젯 렌더링</button>
      {/* 액션 버튼 */}
      <div className="mt-4 flex gap-2">
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

