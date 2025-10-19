import { z } from '@hono/zod-openapi';

export const ChannelSubscriptionSchema = z
  .object({
    id: z.string().openapi({ description: '채널 구독자 ID' }),
    subscribedAt: z.date().openapi({ description: '구독일시' }),
    channelId: z.string().openapi({ description: '채널 ID' }),
    userId: z.string().openapi({ description: '구독한 사용자 ID' }),
  })
  .openapi({ description: '채널 구독자 정보' });
export type ChannelSubscriptionSchema = z.infer<typeof ChannelSubscriptionSchema>;

export const ChannelSubscriptWithUserSchema = ChannelSubscriptionSchema.extend({
  user: z.object({
    email: z.string().openapi({ description: '사용자 이메일' }),
    phoneNumber: z.string().nullable().optional().openapi({ description: '사용자 전화번호' }),
    name: z.string().openapi({ description: '사용자 이름' }),
  }),
}).openapi({ description: '채널 구독자 정보 (사용자 정보 포함)' });
export type ChannelSubscriptWithUserSchema = z.infer<typeof ChannelSubscriptWithUserSchema>;

export const ChannelSubscriptionListSchema = z
  .object({
    data: z.array(ChannelSubscriptionSchema),
    totalCounts: z.number().openapi({ description: '채널 전체 구독자 수' }),
  })
  .openapi({ description: '채널 구독자 목록' });
export type ChannelSubscriptionListSchema = z.infer<typeof ChannelSubscriptionListSchema>;
