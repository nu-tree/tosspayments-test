import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLElement>;

/**
 * NOTE 필수 입력 표시 컴포넌트
 *
 * Input/Label 옆에 붙여서 "필수" 항목임을 시각적으로 표시
 * 빨간색 강조 + 약간의 여백으로 가독성 강화
 * 시각장애인용 접근성 텍스트도 포함
 * 텍스트 뒤에 붙는 기준으로 작성됨
 */
export const InputRequired = ({ className }: Readonly<Props>) => {
  return (
    <div className={cn('-ml-2 align-middle text-sm font-bold text-red-500 select-none', className)}>
      <span>*</span>
      <span className="sr-only">(필수)</span>
    </div>
  );
};
