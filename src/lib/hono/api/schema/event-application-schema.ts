import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';

export const EventApplicationStatus = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']);
export type EventApplicationStatus = z.infer<typeof EventApplicationStatus>;

export const UserInfoSchema = z.object({
  id: z.string().openapi({ description: '사용자 ID' }),
  name: z.string().openapi({ description: '사용자 이름' }),
  email: z.string().openapi({ description: '이메일' }),
  phoneNumber: z.string().nullable().optional().openapi({ description: '전화번호' }),
  image: z.string().nullable().optional().openapi({ description: '프로필 이미지' }),
});
export type UserInfoSchema = z.infer<typeof UserInfoSchema>;

export const EventApplicationSchema = z.object({
  id: z.string().openapi({ description: '이벤트 신청 ID' }),
  createdAt: z.date().openapi({ description: '신청일시' }),
  updatedAt: z.date().openapi({ description: '수정일시' }),

  userId: z.string().openapi({ description: '신청한 사용자 ID' }),
  eventId: z.string().openapi({ description: '신청한 이벤트 ID' }),
  groupId: z.string().openapi({ description: '신청한 이벤트 그룹 ID' }),

  companionCnt: z.number().nullable().optional().openapi({ description: '본인을 제외한 동반 인원 수' }),
  status: EventApplicationStatus,
  paid: z.boolean().default(false),
});

export type EventApplicationSchema = z.infer<typeof EventApplicationSchema>;

export const EventApplicationDetailSchema = EventApplicationSchema.extend({
  user: z
    .object({
      id: z.string().openapi({ description: '신청자 ID' }),
      email: z.string().openapi({ description: '신청자 이메일' }),
      name: z.string().openapi({ description: '신청자 이름' }),
      phoneNumber: z.string().nullable().optional().openapi({ description: '신청자 전화번호' }),
    })
    .openapi({ description: '신청한 사용자 정보' }),
});
export type EventApplicationDetailSchema = z.infer<typeof EventApplicationDetailSchema>;

export const EventApplicationListSchema = z
  .object({
    data: z.array(EventApplicationDetailSchema),
    totalCounts: z.number().openapi({ description: '전체 이벤트 신청 수' }),
  })
  .openapi({ description: '이벤트 신청 목록' });
export type EventApplicationListSchema = z.infer<typeof EventApplicationListSchema>;

export const GetEventApplicationListParamsSchema = BasicGetListSchema.extend({
  userId: z.string().optional().openapi({ description: '사용자 ID로 필터링' }),
  eventId: z.string().optional().openapi({ description: '이벤트 ID로 필터링' }),
  groupId: z.string().optional().openapi({ description: '이벤트 그룹 ID로 필터링' }),
  status: EventApplicationStatus.optional().openapi({ description: '신청 상태로 필터링' }),
  paid: z.string().optional().openapi({ description: '결제 여부로 필터링 (true/false)' }),
  companionCnt: z.string().optional().openapi({ description: '동반 인원 필터 (solo/with-companion/all)' }),
  sortBy: z.enum(['recent', 'oldest']).optional().openapi({ description: '정렬 (recent: 최신순, oldest: 오래된순)' }),
});
export type GetEventApplicationListParamsSchema = z.infer<typeof GetEventApplicationListParamsSchema>;

export const CreateEventApplicationSchema = EventApplicationSchema.pick({
  eventId: true,
  groupId: true,
  companionCnt: true,
}).openapi({ description: '이벤트 신청 생성' });
export type CreateEventApplicationSchema = z.infer<typeof CreateEventApplicationSchema>;

export const UpdateEventApplicationSchema = CreateEventApplicationSchema;
export type UpdateEventApplicationSchema = z.infer<typeof UpdateEventApplicationSchema>;

export const CancelEventApplicationSchema = z
  .object({
    id: z.string().openapi({ description: '취소할 이벤트 신청 ID' }),
  })
  .openapi({ description: '이벤트 신청 취소' });
export type CancelEventApplicationSchema = z.infer<typeof CancelEventApplicationSchema>;

export const PatchEventApplicationSchema = z
  .object({
    status: EventApplicationStatus.optional(),
    paid: z.boolean().optional(),
    companionCnt: z.number().nullable().optional(),
  })
  .openapi({ description: '이벤트 신청 부분 수정' });
export type PatchEventApplicationSchema = z.infer<typeof PatchEventApplicationSchema>;

export const BatchCreateEventApplicationSchema = z
  .object({
    applications: z.array(
      z.object({
        groupId: z.string(),
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string(),
        companionCnt: z.number().default(0),
        paid: z.boolean().default(false),
      }),
    ),
  })
  .openapi({ description: '이벤트 신청 일괄 추가 (엑셀 업로드)' });
export type BatchCreateEventApplicationSchema = z.infer<typeof BatchCreateEventApplicationSchema>;

export const BatchDeleteEventApplicationsSchema = z
  .object({
    ids: z
      .array(z.string().openapi({ description: '이벤트 신청 ID' }))
      .openapi({ description: '삭제할 이벤트 신청 ID 목록' }),
  })
  .openapi({ description: '이벤트 신청 일괄 삭제' });
export type BatchDeleteEventApplicationsSchema = z.infer<typeof BatchDeleteEventApplicationsSchema>;

export const EventApplicationStatsSchema = z
  .object({
    total: z.number().openapi({ description: '전체 신청 수' }),
    confirmed: z.number().openapi({ description: '확정된 신청 수' }),
    pending: z.number().openapi({ description: '대기 중인 신청 수' }),
    cancelled: z.number().openapi({ description: '취소된 신청 수' }),
  })
  .openapi({ description: '이벤트 신청 통계' });
export type EventApplicationStatsSchema = z.infer<typeof EventApplicationStatsSchema>;

export const GetEventApplicationStatsParamsSchema = z.object({
  eventId: z.string().optional().openapi({ description: '이벤트 ID로 필터링' }),
  groupId: z.string().optional().openapi({ description: '이벤트 그룹 ID로 필터링' }),
});
export type GetEventApplicationStatsParamsSchema = z.infer<typeof GetEventApplicationStatsParamsSchema>;
