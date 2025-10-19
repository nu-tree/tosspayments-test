import { NotificationEmail } from '@/components/custom-ui/email-templates/notification-email';
import { PasswordResetEmail } from '@/components/custom-ui/email-templates/password-reset-email';
import { VerificationEmailTemplate } from '@/components/custom-ui/email-templates/verification-email-template';
import { WelcomeEmail } from '@/components/custom-ui/email-templates/welcome-email';
import { z } from 'zod';
import { EmailTemplate, EmailTemplateDefinition } from './type/email-generic.types';

export const emailTemplateRegistry = {
  welcome: {
    component: WelcomeEmail,
    subject: '🎉 WeFactory에 오신 것을 환영합니다!',
    propsSchema: z.object({
      password: z.string().optional(),
    }),
  },
  'password-reset': {
    component: PasswordResetEmail,
    subject: '🔐 비밀번호 재설정 요청',
    propsSchema: z.object({
      url: z.string().optional(),
    }),
  },
  notification: {
    component: NotificationEmail,
    subject: '🔔 새로운 알림이 도착했습니다',
    propsSchema: z.object({}),
  },
  'email-verification': {
    component: VerificationEmailTemplate,
    subject: '📧 이메일 인증 코드',
    propsSchema: z.object({
      otp: z.string().optional(),
      url: z.string().optional(),
    }),
  },
} as const satisfies Record<string, EmailTemplateDefinition>;

// 이메일 템플릿 가져오기 함수
export const getEmailTemplate = <T extends EmailTemplate>(template: T) => {
  return emailTemplateRegistry[template] as (typeof emailTemplateRegistry)[T];
};
