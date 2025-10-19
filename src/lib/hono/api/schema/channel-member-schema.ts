import { z } from '@hono/zod-openapi';

export const ChannelMemberSchema = z.object({
  id: z.string().openapi({ description: '채널 멤버 ID' }),
  createdAt: z.string().openapi({ description: '생성일시' }),
  updatedAt: z.string().openapi({ description: '수정일시' }),
  channelId: z.string().openapi({ description: '채널 ID' }),
  userId: z.string().openapi({ description: '채널 멤버 ID' }),
  role: z.string().openapi({ description: '채널 멤버 역할' }),
});
export type ChannelMemberSchema = z.infer<typeof ChannelMemberSchema>;

export const ChannelMemberWithUserSchema = ChannelMemberSchema.extend({
  user: z.object({
    email: z.string().openapi({ description: '사용자 이메일' }),
    phoneNumber: z.string().nullable().optional().openapi({ description: '사용자 전화번호' }),
    name: z.string().openapi({ description: '사용자 이름' }),
  }),
}).openapi({ description: '채널 멤버 정보 (사용자 정보 포함)' });
export type ChannelMemberWithUserSchema = z.infer<typeof ChannelMemberWithUserSchema>;
