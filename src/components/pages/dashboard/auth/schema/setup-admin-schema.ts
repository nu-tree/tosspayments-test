import { z } from 'zod';

export const SetupAdminSchema = z
  .object({
    name: z
      .string({ error: '이름을 입력해주세요' })
      .min(1, { error: '이름을 입력해주세요' })
      .min(2, { error: '이름은 2글자 이상이어야 합니다' })
      .max(50, { error: '이름은 50글자 이하여야 합니다' })
      .regex(/^[가-힣a-zA-Z]+$/, { error: '이름은 한글, 영문만 입력 가능합니다' }),

    email: z
      .string({ error: '이메일을 입력해주세요' })
      .min(1, { error: '이메일을 입력해주세요' })
      .pipe(z.email({ error: '올바른 이메일 형식을 입력해주세요' }))
      .pipe(z.string().max(30, { error: '이메일은 30글자 이하여야 합니다' })),

    password: z
      .string({ error: '비밀번호를 입력해주세요' })
      .min(1, { error: '비밀번호를 입력해주세요' })
      .min(8, { error: '비밀번호는 8자 이상이어야 합니다' })
      .max(50, { error: '비밀번호는 50자 이하여야 합니다' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        error: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다',
      }),

    passwordConfirm: z
      .string({ error: '비밀번호 확인을 입력해주세요' })
      .min(1, { error: '비밀번호 확인을 입력해주세요' }),

    phoneNumber: z
      .string({ error: '전화번호를 입력해주세요' })
      .min(1, { error: '전화번호를 입력해주세요' })
      .regex(/^(01[016789])-?(\d{3,4})-?(\d{4})$/, {
        error: '올바른 휴대폰 번호 형식을 입력해주세요 (예: 010-1234-5678)',
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

export type SetupAdminSchema = z.infer<typeof SetupAdminSchema>;
