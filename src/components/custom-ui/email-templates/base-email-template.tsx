import React from 'react';
import { Tailwind, Html, Head, Body, Container, Section, Text, Hr } from '@react-email/components';

type Props = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export const BaseEmailTemplate = ({ className, children }: Readonly<Props>) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Header */}
            <Section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-8 py-12 text-center text-white">
              <Text className="mb-2 text-3xl font-bold tracking-wide">WeFactory</Text>
              <Text className="text-sm text-blue-100">Admin Dashboard</Text>
            </Section>

            {/* Content */}
            <Section className="bg-white p-8">{children}</Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-8 py-6 text-center">
              <Hr className="mb-4 border-gray-200" />
              <Text className="mb-2 text-sm text-gray-600">© 2024 WeFactory. All rights reserved.</Text>
              <Text className="text-xs text-gray-500">이 이메일은 WeFactory 시스템에서 자동으로 발송되었습니다.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
