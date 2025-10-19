import React from 'react';
import { BaseEmailTemplate } from './base-email-template';
import { Text, Button, Hr, Section, Row, Column } from '@react-email/components';

type Props = React.HTMLAttributes<HTMLElement>;

export const NotificationEmail = ({ className }: Readonly<Props>) => {
  return (
    <BaseEmailTemplate>
      <Section className="text-center">
        <Text className="mb-4 text-2xl font-bold text-gray-800">새로운 알림이 도착했습니다</Text>

        <Text className="mb-6 text-base leading-relaxed text-gray-600">안녕하세요! 새로운 알림이 도착했습니다.</Text>

        <Section className="my-6 rounded-md border border-gray-200 bg-gray-50 p-6">
          <Text className="text-base leading-relaxed text-gray-700">
            새로운 알림이 도착했습니다. 확인해보시기 바랍니다.
          </Text>
        </Section>

        <Button
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
        >
          📊 대시보드로 이동
        </Button>

        <Hr className="my-8 border-gray-200" />

        {/* Quick Actions */}
        <Section className="text-center">
          <Text className="mb-6 text-lg font-semibold text-gray-800">🚀 빠른 액션</Text>

          <Row className="mx-auto max-w-md">
            <Column className="text-center">
              <Button
                href="/admin/members"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                👥 사용자 관리
              </Button>
            </Column>
            <Column className="text-center">
              <Button
                href="/admin/posts"
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                📝 게시글 관리
              </Button>
            </Column>
          </Row>
        </Section>

        <Hr className="my-8 border-gray-200" />

        <Text className="text-sm text-gray-500">이 알림에 대해 문의사항이 있으시면 관리자에게 연락해주세요.</Text>
      </Section>
    </BaseEmailTemplate>
  );
};
