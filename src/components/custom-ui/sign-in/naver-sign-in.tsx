'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { SiNaver } from 'react-icons/si';

type Props = React.HTMLAttributes<HTMLElement>;

export const NaverSignIn = ({ className }: Readonly<Props>) => {
  const handleNaverSignIn = async () => {
    await signIn.social({
      provider: 'naver',
    });
  };

  return (
    <Button
      type="button"
      className={cn(
        'h-12 w-full rounded-md py-3 font-bold text-white',
        'bg-[#02C75B] hover:bg-[#02C75B]/80',
        'shadow-lg shadow-[#02C75B]/30',
      )}
      onClick={handleNaverSignIn}
    >
      <SiNaver className="size-5" />
      네이버로 시작하기
    </Button>
  );
};
