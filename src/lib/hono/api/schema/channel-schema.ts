import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';
import { EventListSchema } from './event-schema';
import { ChannelSubscriptWithUserSchema } from './channel-subscription-schema';
import { ChannelMemberWithUserSchema } from './channel-member-schema';

export const ChannelSchema = z
  .object({
    id: z.string().openapi({ description: '채널 ID' }),
    createdAt: z.date().openapi({ description: '생성일시' }),
    updatedAt: z.date().openapi({ description: '수정일시' }),
    userId: z.string().openapi({ description: '채널을 생성한 사용자 ID' }),
    name: z.string().openapi({ description: '채널 이름' }),
    description: z.string().optional().nullable().openapi({ description: '채널 설명' }),
    thumbnail: z.string().optional().nullable().openapi({ description: '채널 썸네일 URL' }),
  })
  .openapi({ description: '채널 정보' });
export type ChannelSchema = z.infer<typeof ChannelSchema>;

export const ChannelWithSubSchema = ChannelSchema.extend({
  _count: z.object({
    subscribers: z.number().openapi({ description: '채널 구독자 수' }),
  }),
}).openapi({ description: '채널 정보 (구독자 수 포함)' });
export type ChannelWithSubSchema = z.infer<typeof ChannelWithSubSchema>;

export const ChannelListSchema = z
  .object({
    data: z.array(ChannelWithSubSchema),
    totalCounts: z.number().openapi({ description: '전체 채널 수' }),
  })
  .openapi({ description: '채널 목록' });
export type ChannelListSchema = z.infer<typeof ChannelListSchema>;

export const ChannelDetailSchema = ChannelWithSubSchema.extend({
  events: z.lazy(() => EventListSchema),
  subscribers: z
    .array(ChannelSubscriptWithUserSchema)
    .optional()
    .openapi({ description: '채널 구독자 목록 (관리자 및 채널 개설자만 포함)' }),
  members: z
    .array(ChannelMemberWithUserSchema)
    .optional()
    .openapi({ description: '채널 멤버 목록 (관리자 및 채널 개설자만 포함)' }),
}).openapi({ description: '채널 상세 정보' });
export type ChannelDetailSchema = z.infer<typeof ChannelDetailSchema>;

export const GetChannelListParamsSchema = BasicGetListSchema.extend({
  name: z.string().optional().openapi({ description: '채널 이름으로 필터링' }),
  userId: z.string().optional().openapi({ description: '사용자 ID로 필터링' }),
});
export type GetChannelListParamsSchema = z.infer<typeof GetChannelListParamsSchema>;

export const CreateChannelSchema = ChannelSchema.pick({
  name: true,
  description: true,
  thumbnail: true,
}).openapi({ description: '채널 생성' });
export type CreateChannelSchema = z.infer<typeof CreateChannelSchema>;

export const UpdateChannelSchema = CreateChannelSchema;
export type UpdateChannelSchema = z.infer<typeof UpdateChannelSchema>;

export const DeleteChannelSchema = z
  .object({
    id: z.string().openapi({ description: '채널 ID' }),
  })
  .openapi({ description: '채널 삭제' });
export type DeleteChannelSchema = z.infer<typeof DeleteChannelSchema>;
