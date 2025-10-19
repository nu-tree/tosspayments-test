'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { FaGoogle } from 'react-icons/fa';

type Props = React.HTMLAttributes<HTMLElement>;

export const GoogleSignIn = ({ className }: Readonly<Props>) => {
  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: 'google',
    });
  };

  return (
    <Button
      type="button"
      className={cn(
        'h-12 w-full rounded-md py-2 font-bold text-gray-800',
        'bg-white hover:bg-gray-50',
        'border-2 border-gray-200',
      )}
      onClick={handleGoogleSignIn}
    >
      <FaGoogle />
      구글로 시작하기
    </Button>
  );
};
