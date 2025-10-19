import React from 'react';
import { BaseEmailTemplate } from './base-email-template';
import { Text, Hr, Section, Heading } from '@react-email/components';

type Props = React.HTMLAttributes<HTMLElement> & {
  otp?: string;
  url?: string;
};

export const VerificationEmailTemplate = ({ className, otp, url }: Props) => {
  return (
    <BaseEmailTemplate>
      <Section className="text-center">
        <Heading className="mb-4 text-2xl font-bold text-gray-800">이메일 인증 코드</Heading>

        <Text className="mb-6 text-base leading-relaxed text-gray-600">
          회원가입을 완료하기 위해 아래 인증 코드를 입력해주세요.
        </Text>

        {/* OTP 코드 표시 */}
        {otp && (
          <Section className="my-8">
            <div
              style={{
                display: 'inline-block',
                padding: '20px 40px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
              }}
            >
              <Text
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  letterSpacing: '8px',
                  color: '#1f2937',
                  margin: 0,
                  fontFamily: 'monospace',
                }}
              >
                {otp}
              </Text>
            </div>

            <Text className="mt-4 text-sm text-gray-500">인증 코드는 10분간 유효합니다.</Text>
          </Section>
        )}

        <Hr className="my-8 border-gray-200" />

        <Text className="text-sm text-gray-500">
          본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.
          <br />
          문의사항이 있으시면 관리자에게 연락해주세요.
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};
