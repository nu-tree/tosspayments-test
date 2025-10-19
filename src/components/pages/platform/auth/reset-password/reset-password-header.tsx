import { KeyRound } from 'lucide-react';

/**
 * 비밀번호 재설정 페이지 헤더
 */
export const ResetPasswordHeader = () => {
  return (
    <div className="mb-8 space-y-3 text-center">
      <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
        <KeyRound className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">새 비밀번호 설정</h1>
        <p className="text-muted-foreground text-sm">안전한 비밀번호를 설정해주세요</p>
      </div>
    </div>
  );
};

