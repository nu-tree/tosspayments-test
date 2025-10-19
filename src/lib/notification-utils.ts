'use server';

import { Resend } from 'resend';
import { getEmailTemplate } from '@/server/notification/email-template.registry';
import React from 'react';

// 타입 정의
export type EmailTemplate = 'welcome' | 'password-reset' | 'notification' | 'email-verification';

export type SendEmailOptions = {
  email: string;
  template: EmailTemplate;
  emailTemplateProps?: Record<string, unknown>;
};

export type SendSMSOptions = {
  message: string;
  phoneNumber: string;
};

export type SendAlimtalkOptions = {
  phoneNumber: string;
  templateId: string;
  variables?: Record<string, string>;
  userId?: string;
  message?: string;
};

export type NotificationResult = {
  success: boolean;
  message: string;
  data?: any;
};

/**
 * 이메일 발송 유틸리티
 */
export async function sendEmail(options: SendEmailOptions): Promise<NotificationResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const templateDef = getEmailTemplate(options.template);
    const Component: React.ComponentType<any> = templateDef.component;

    const emailOptions = {
      from: process.env.RESEND_SENDER_DOMAIN || 'onboarding@resend.dev',
      to: options.email,
      subject: templateDef.subject,
      react: React.createElement(Component as any, options.emailTemplateProps || {}),
    };

    const result = await resend.emails.send(emailOptions);

    if (result.error) {
      return {
        success: false,
        message: '이메일 발송에 실패했습니다.',
        data: result.error,
      };
    }

    return {
      success: true,
      message: '이메일이 성공적으로 발송되었습니다.',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: '이메일 발송 중 오류가 발생했습니다.',
      data: error,
    };
  }
}

/**
 * SMS 발송 유틸리티 (solapi 설정 필요)
 */
export async function sendSMS(options: SendSMSOptions): Promise<NotificationResult> {
  // TODO: solapi 설정 후 구현
  return {
    success: false,
    message: 'SMS 발송 기능은 아직 구현되지 않았습니다.',
    data: options,
  };
}

/**
 * 알림톡 발송 유틸리티 (solapi 설정 필요)
 */
export async function sendAlimtalk(options: SendAlimtalkOptions): Promise<NotificationResult> {
  // TODO: solapi 설정 후 구현
  return {
    success: false,
    message: '알림톡 발송 기능은 아직 구현되지 않았습니다.',
    data: options,
  };
}

/**
 * 통합 알림 발송 유틸리티 (이메일, SMS, 알림톡을 한 번에)
 */
export async function sendNotification({
  email,
  sms,
  alimtalk,
}: {
  email?: SendEmailOptions;
  sms?: SendSMSOptions;
  alimtalk?: SendAlimtalkOptions;
}): Promise<{
  email?: NotificationResult;
  sms?: NotificationResult;
  alimtalk?: NotificationResult;
}> {
  const results: any = {};

  if (email) {
    results.email = await sendEmail(email);
  }

  if (sms) {
    results.sms = await sendSMS(sms);
  }

  if (alimtalk) {
    results.alimtalk = await sendAlimtalk(alimtalk);
  }

  return results;
}
