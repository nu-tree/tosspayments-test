'use client';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { CommonForm } from '@/components/custom-ui/form-ui/common-form';
import { CheckboxInput, TextInput } from '@/components/custom-ui/form-ui/form-input';
import { SignInSchema } from './schema/sign-in-schema';
import { useSignIn } from '@/hooks/pages/auth/dashboard/use-sign-in';

type Props = React.HTMLAttributes<HTMLElement>;

export const SignInForm = ({ className }: Readonly<Props>) => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit } = useSignIn();

  return (
    <CommonForm handleSubmit={handleSubmit} formInstance={form} className={cn('space-y-5', className)}>
      <TextInput schema={SignInSchema} name="email" label="이메일" placeholder="honbab@example.com" type="email" />

      <TextInput
        schema={SignInSchema}
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        type="password"
      />

      <CheckboxInput schema={SignInSchema} name="rememberMe" label="로그인 상태 유지" />

      <Button type="submit" className="w-full">
        로그인
      </Button>
    </CommonForm>
  );
};
