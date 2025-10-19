'use client';

import { Button } from '@/components/ui/button';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommonForm } from '@/components/custom-ui/form-ui/common-form';
import { TextInput, CheckboxInput } from '@/components/custom-ui/form-ui/form-input';
import { SignUpSchema } from '../schema/sign-up-schema';
import { useSignUp } from '@/hooks/pages/auth/platform/use-sign-up';
import { OTPSendButton } from '../otp/otp-send-button';
import { OTPInput } from '../otp/otp-input';
import Link from 'next/link';
import { useState } from 'react';

/**
 * 이메일 회원가입 폼
 */
export const SignUpForm = () => {
  const { handleSubmit, isPending } = useSignUp();
  const [showOTPInput, setShowOTPInput] = useState(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      termsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
      isEmailVerified: false,
      otpCode: '',
      email: '',
      name: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // useWatch를 사용하여 실시간 값 감지
  const email = useWatch({
    control: form.control,
    name: 'email',
    defaultValue: '',
  });

  const isEmailVerified = useWatch({
    control: form.control,
    name: 'isEmailVerified',
    defaultValue: false,
  });

  const otpCode = useWatch({
    control: form.control,
    name: 'otpCode',
    defaultValue: '',
  });


  return (
    <CommonForm handleSubmit={handleSubmit} formInstance={form} className="space-y-4">
      {/* 이름 */}
      <TextInput schema={SignUpSchema} name="name" label="이름" placeholder="홍길동" />

      {/* 전화번호 */}
      <TextInput
        schema={SignUpSchema}
        name="phoneNumber"
        label="전화번호"
        placeholder="01012345678"
        type="tel"
      />

      {/* 이메일 */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <TextInput
              schema={SignUpSchema}
              name="email"
              label="이메일"
              placeholder="example@meetica.com"
              type="email"
              disabled={isEmailVerified || showOTPInput}
            />
          </div>
          <div className="flex items-end">
            <OTPSendButton
              email={email || ''}
              onSent={() => setShowOTPInput(true)}
              disabled={isEmailVerified}
              isVerified={isEmailVerified}
            />
          </div>
        </div>

        {/* OTP 입력 */}
        {showOTPInput && (
          <OTPInput
            email={email || ''}
            value={otpCode || ''}
            onChange={(value) => form.setValue('otpCode', value)}
            onVerified={() => form.setValue('isEmailVerified', true)}
            isVerified={isEmailVerified}
          />
        )}
      </div>

      {/* 비밀번호 */}
      <TextInput
        schema={SignUpSchema}
        name="password"
        label="비밀번호"
        placeholder="8자 이상 입력해주세요"
        type="password"
      />

      {/* 비밀번호 확인 */}
      <TextInput
        schema={SignUpSchema}
        name="passwordConfirm"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요"
        type="password"
      />

      {/* 약관 동의 */}
      <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium">약관 동의</p>
        <div className="space-y-2">
          <CheckboxInput
            schema={SignUpSchema}
            name="termsAgreed"
            label={
              <span className="flex items-center gap-1.5 text-sm">
                <span>이용약관에 동의합니다 (필수)</span>
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary/80 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium transition-colors"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  보기
                </Link>
              </span>
            }
          />
          <CheckboxInput
            schema={SignUpSchema}
            name="privacyAgreed"
            label={
              <span className="flex items-center gap-1.5 text-sm">
                <span>개인정보처리방침에 동의합니다 (필수)</span>
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary/80 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium transition-colors"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  보기
                </Link>
              </span>
            }
          />
          <CheckboxInput
            schema={SignUpSchema}
            name="marketingAgreed"
            label={
              <span className="flex items-center gap-1.5 text-sm">
                <span>마케팅 정보 수신에 동의합니다 (선택)</span>
                <Link
                  href="/marketing"
                  className="text-primary hover:text-primary/80 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium transition-colors"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  보기
                </Link>
              </span>
            }
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <Button type="submit" className="w-full" disabled={isPending}>
        회원가입
      </Button>
    </CommonForm>
  );
};
