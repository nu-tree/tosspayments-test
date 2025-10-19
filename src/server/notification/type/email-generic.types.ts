import z from 'zod';
import { emailTemplateRegistry } from '../email-template.registry';

// 이메일 템플릿 등록 시스템
export type EmailTemplateDefinition<T = any> = {
  component: React.ComponentType<T>;
  subject: string;
  propsSchema: z.ZodSchema;
};

// 타입 추론을 위한 타입들 (완전 자동 생성됨!)
export type EmailTemplate = keyof typeof emailTemplateRegistry;
export type EmailTemplateProps = {
  [K in EmailTemplate]: z.infer<(typeof emailTemplateRegistry)[K]['propsSchema']>;
};

// 타입 안전한 이메일 발송 요청 타입
export type TypedEmailRequest<T extends EmailTemplate> = {
  email: string;
  template: T;
  emailTemplateProps: EmailTemplateProps[T];
  subject?: string;
};

// 타입 안전한 이메일 요청 타입 (컴파일 타임 타입 체크용)
export type TypedSendEmailRequest<T extends keyof typeof emailTemplateRegistry> = {
  email: string;
  template: T;
  emailTemplateProps: EmailTemplateProps[T];
};
