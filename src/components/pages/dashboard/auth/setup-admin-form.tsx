'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { CommonForm } from '@/components/custom-ui/form-ui/common-form';
import { TextInput } from '@/components/custom-ui/form-ui/form-input';
import { SetupAdminSchema } from './schema/setup-admin-schema';
import { useSetup } from '@/hooks/pages/auth/dashboard/use-setup';
import { Shield } from 'lucide-react';

type Props = React.HTMLAttributes<HTMLElement>;

export const SetupAdminForm = ({ className }: Readonly<Props>) => {
  const { handleSubmit } = useSetup();

  const form = useForm<SetupAdminSchema>({
    resolver: zodResolver(SetupAdminSchema),
  });

  return (
    <CommonForm handleSubmit={handleSubmit} formInstance={form} className={cn('space-y-5', className)}>
      <div className="space-y-5">
        <TextInput schema={SetupAdminSchema} name="name" label="관리자 이름" placeholder="관리자 이름을 입력하세요" />
        <TextInput schema={SetupAdminSchema} name="phoneNumber" label="전화번호" placeholder="전화번호를 입력하세요" />
        <TextInput
          schema={SetupAdminSchema}
          name="email"
          label="이메일 주소"
          placeholder="admin@example.com"
          type="email"
        />
        <TextInput
          schema={SetupAdminSchema}
          name="password"
          label="비밀번호"
          placeholder="8자 이상 입력하세요"
          type="password"
        />
        <TextInput
          schema={SetupAdminSchema}
          name="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          type="password"
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90 h-12 w-full font-medium">
          <Shield className="mr-2 h-4 w-4" />
          관리자 계정 생성
        </Button>
      </div>

      <div className="pt-2 text-center">
        <p className="text-muted-foreground text-xs">계정 생성 시 관리자 권한이 부여됩니다</p>
      </div>
    </CommonForm>
  );
};
