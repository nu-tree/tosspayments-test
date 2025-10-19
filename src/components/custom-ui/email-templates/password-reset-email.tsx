import React from 'react';
import { BaseEmailTemplate } from './base-email-template';
import { Text, Button, Hr, Section, Row, Column } from '@react-email/components';

type Props = React.HTMLAttributes<HTMLElement> & {
  url?: string;
};

export const PasswordResetEmail = ({ className, url }: Readonly<Props>) => {
  return (
    <BaseEmailTemplate>
      <Section className="text-center">
        <Text className="mb-4 text-2xl font-bold text-gray-800">🔐 비밀번호 재설정 요청</Text>

        <Text className="mb-6 text-base leading-relaxed text-gray-600">
          안녕하세요!
          <br />
          WeFactory 계정의 비밀번호 재설정을 요청하셨습니다.
        </Text>

        <Text className="mb-8 text-base leading-relaxed text-gray-600">
          아래 버튼을 클릭하여 새로운 비밀번호를 설정하실 수 있습니다. 이 링크는 <strong>24시간</strong>까지 유효합니다.
        </Text>

        <Button
          href={url || '/reset-password'}
          className="rounded-lg bg-red-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700"
        >
          🔑 비밀번호 재설정
        </Button>

        <Hr className="my-8 border-gray-200" />

        {/* Security Notice */}
        <Section className="my-6 rounded-md border border-yellow-200 bg-yellow-50 p-6">
          <Text className="mb-4 text-lg font-semibold text-yellow-800">⚠️ 보안 안내</Text>

          <Row className="mx-auto max-w-md">
            <Column className="text-left">
              <Text className="mb-2 text-yellow-700">• 본인이 요청하지 않은 경우 이 링크를 무시하세요</Text>
              <Text className="mb-2 text-yellow-700">• 링크는 한 번만 사용 가능합니다</Text>
            </Column>
            <Column className="text-left">
              <Text className="mb-2 text-yellow-700">• 비밀번호는 안전하게 관리해주세요</Text>
              <Text className="mb-2 text-yellow-700">• 의심스러운 활동이 있다면 즉시 신고하세요</Text>
            </Column>
          </Row>
        </Section>

        <Hr className="my-8 border-gray-200" />

        <Text className="text-sm text-gray-500">문제가 있으시면 고객센터에 연락해주세요.</Text>
      </Section>
    </BaseEmailTemplate>
  );
};
