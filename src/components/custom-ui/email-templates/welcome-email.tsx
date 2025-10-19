import React from 'react';
import { BaseEmailTemplate } from './base-email-template';
import { Text, Button, Hr, Section, Row, Column } from '@react-email/components';

type Props = React.HTMLAttributes<HTMLElement> & {
  password?: string; // Optional prop for initial password
};

export const WelcomeEmail = ({ className, password }: Readonly<Props>) => {
  return (
    <BaseEmailTemplate>
      <Section className="text-center">
        <Text className="mb-4 text-2xl font-bold text-gray-800">안녕하세요! WeFactory 계정이 생성되었습니다.</Text>

        <Text className="mb-6 text-base leading-relaxed text-gray-600">
          관리자가 회원님의 계정을 생성하였습니다.
          <br />
          초기 비밀번호를 사용하여 로그인 후, 비밀번호를 변경해주세요.
        </Text>

        <Text className="mb-4 text-base leading-relaxed text-gray-600">
          초기 비밀번호: <strong>{password}</strong>
        </Text>

        <Text className="mb-8 text-base leading-relaxed text-gray-600">
          아래 버튼을 클릭하여 로그인하시고 서비스를 시작해보세요.
        </Text>

        <Button
          href="/sign-in"
          className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
        >
          🚀 로그인하기
        </Button>

        <Hr className="my-8 border-gray-200" />

        {/* Features */}
        <Section className="text-center">
          <Text className="mb-4 text-lg font-semibold text-gray-800">✨ 주요 기능</Text>

          <Row className="mx-auto max-w-md">
            <Column className="text-left">
              <Text className="mb-3 text-gray-700">📊 대시보드를 통한 실시간 모니터링</Text>
              <Text className="mb-3 text-gray-700">👥 사용자 및 조직 관리</Text>
            </Column>
            <Column className="text-left">
              <Text className="mb-3 text-gray-700">📝 게시판 및 콘텐츠 관리</Text>
              <Text className="mb-3 text-gray-700">💬 문의사항 및 알림 관리</Text>
            </Column>
          </Row>
        </Section>

        <Hr className="my-8 border-gray-200" />

        <Text className="text-sm text-gray-500">문의사항이 있으시면 언제든지 고객센터에 연락해주세요.</Text>
      </Section>
    </BaseEmailTemplate>
  );
};
