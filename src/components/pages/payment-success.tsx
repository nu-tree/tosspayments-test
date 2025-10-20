'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * 결제 성공 컴포넌트
 * - 결제 승인 API를 호출하여 최종 결제를 완료합니다
 * - 결제 요청 시 전달한 데이터와 쿼리 파라미터를 비교하여 보안을 강화합니다
 */
export const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // 쿼리 파라미터 추출
  // ============================================================
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const paymentKey = searchParams.get('paymentKey');

  // ============================================================
  // 결제 승인 처리
  // ============================================================
  useEffect(() => {
    // 필수 파라미터 체크
    if (!orderId || !amount || !paymentKey) {
      setError('결제 정보가 올바르지 않습니다.');
      setIsConfirming(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        setIsConfirming(true);

        // 서버에 결제 승인 요청
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount,
            paymentKey,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // 결제 승인 실패 시 fail 페이지로 이동
          router.push(`/tosspay-ments/fail?message=${result.message}&code=${result.code}`);
          return;
        }

        // 결제 승인 성공
        console.log('결제 승인 완료:', result);
        setIsConfirming(false);
      } catch (err) {
        console.error('결제 승인 중 오류 발생:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [orderId, amount, paymentKey, router]);

  // ============================================================
  // 렌더링: 에러 상태
  // ============================================================
  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-red-600">오류 발생</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/tosspay-ments')}
            className="mt-6 w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            돌아가기
          </button>
        </div>
      </section>
    );
  }

  // ============================================================
  // 렌더링: 승인 중 상태
  // ============================================================
  if (isConfirming) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">결제 승인 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // 렌더링: 성공 화면
  // ============================================================
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">결제 성공</h2>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">주문번호</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">결제 금액</span>
            <span className="font-medium text-gray-800">{Number(amount).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">결제 키</span>
            <span className="truncate font-mono text-sm text-gray-800">{paymentKey}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/tosspay-ments')}
          className="mt-8 w-full rounded bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
        >
          확인
        </button>
      </div>
    </section>
  );
};

