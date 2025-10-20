'use client';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 결제 실패 컴포넌트
 * - 결제 실패 사유를 사용자에게 안내합니다
 * - 에러 코드와 메시지를 표시합니다
 */
export const PaymentFail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================================================
  // 쿼리 파라미터 추출
  // ============================================================
  const errorCode = searchParams.get('code') || '알 수 없는 오류';
  const errorMessage = searchParams.get('message') || '결제에 실패했습니다.';

  // ============================================================
  // 렌더링: 실패 화면
  // ============================================================
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">결제 실패</h2>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div>
            <p className="mb-2 text-sm text-gray-600">오류 코드</p>
            <p className="font-mono text-sm text-red-600">{errorCode}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-600">오류 메시지</p>
            <p className="text-gray-800">{errorMessage}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <button
            onClick={() => router.push('/tosspay-ments')}
            className="flex-1 rounded bg-gray-500 px-4 py-3 text-white hover:bg-gray-600"
          >
            다시 시도
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 rounded bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
          >
            홈으로
          </button>
        </div>
      </div>
    </section>
  );
};

