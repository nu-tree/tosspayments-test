'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { RiKakaoTalkFill } from 'react-icons/ri';

type Props = React.HTMLAttributes<HTMLElement>;

export const KakaoSignIn = ({ className }: Readonly<Props>) => {
  const handleKakaoSignIn = async () => {
    await signIn.social({
      provider: 'kakao',
    });
  };

  return (
    <Button
      type="button"
      className={cn(
        'h-12 w-full rounded-md py-2 font-bold text-black',
        'bg-[#FFE814] hover:bg-[#FFE814]/80',
        'shadow-lg shadow-[#FFE814]/30',
      )}
      onClick={handleKakaoSignIn}
    >
      <RiKakaoTalkFill className="size-8" />
      카카오로 시작하기
    </Button>
  );
};
