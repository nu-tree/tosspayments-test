import { z } from 'zod';
import { emailTemplateRegistry } from '../email-template.registry';

// 레지스트리에서 자동으로 enum 생성
export const EmailTemplate = z.enum(
  Object.keys(emailTemplateRegistry) as [
    keyof typeof emailTemplateRegistry,
    ...Array<keyof typeof emailTemplateRegistry>,
  ],
);

export type EmailTemplate = z.infer<typeof EmailTemplate>;
