import { NotFoundError } from '@/components/pages/common/unified-error';

/**
 * 404 에러 (페이지를 찾을 수 없음)를 처리하는 컴포넌트
 * - 통합 에러 컴포넌트를 사용하여 일관된 404 에러 처리 제공
 */
export default function NotFound() {
  return <NotFoundError />;
}
