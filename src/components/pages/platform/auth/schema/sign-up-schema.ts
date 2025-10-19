import { z } from 'zod';

export const SignUpSchema = z
  .object({
    name: z.string('이름을 입력해주세요'),
    phoneNumber: z
      .string('전화번호를 입력해주세요')
      .min(1, '전화번호를 입력해주세요')
      .regex(/^01[0-9]{8,9}$/, '올바른 전화번호 형식을 입력해주세요'),
    email: z.email('올바른 이메일 형식을 입력해주세요'),
    password: z.string('비밀번호를 입력해주세요').min(8, '비밀번호는 8자 이상 입력해주세요'),
    passwordConfirm: z.string('비밀번호 확인을 입력해주세요'),
    // OTP 인증
    otpCode: z.string().optional(),
    isEmailVerified: z.boolean().refine((val) => val === true, {
      message: '이메일 인증을 완료해주세요.',
    }),
    // 약관 동의
    termsAgreed: z.boolean('이용약관에 동의해주세요.').refine((val) => val === true, {
      message: '이용약관에 동의해주세요.',
    }),
    privacyAgreed: z.boolean('개인정보 처리방침에 동의해주세요.').refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요.',
    }),
    marketingAgreed: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignUpSchema = z.infer<typeof SignUpSchema>;
