import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';

export const EventType = z.enum(['OFFLINE', 'ONLINE', 'NONE']).openapi({ description: '이벤트 장소 유형' });
export type EventType = z.infer<typeof EventType>;

export const EventGroupSchema = z
  .object({
    id: z.string().openapi({ description: '이벤트 그룹 ID' }),
    createdAt: z.date().openapi({ description: '생성일시' }),
    updatedAt: z.date().openapi({ description: '수정일시' }),
    eventId: z.string().openapi({ description: '이벤트 ID' }),
    name: z.string().openapi({ description: '이벤트 그룹 이름' }),
    capacity: z.number().nullable().optional().openapi({ description: '모집 정원' }),
    isPaid: z.boolean().openapi({ description: '유료 여부' }),
    price: z.number().nullable().optional().openapi({ description: '유료일 경우 가격' }),
    isPublic: z.boolean().openapi({ description: '공개 여부' }),
    isFirstCome: z
      .boolean()
      .openapi({ description: 'true는 선착순 모집, false는 담당자가 신청자 중 참여자를 직접 선택' }),
    companionCnt: z.number().nullable().optional().openapi({ description: '참여자가 동반 가능한 인원 수' }),
    allowOverflow: z
      .boolean()
      .openapi({ description: 'true는 모집 정원 초과 해도 신청 가능(대기자 모집) false는 정원 초과시 신청 마감' }),
    startAt: z.date().openapi({ description: '이벤트 시작일시' }),
    endAt: z.date().openapi({ description: '이벤트 종료일시' }),
    applyStart: z.date().openapi({ description: '이벤트 신청 시작일시' }),
    applyEnd: z.date().openapi({ description: '이벤트 신청 종료일시' }),
    type: EventType,
    address: z.string().nullable().optional().openapi({ description: '오프라인일 경우 장소 주소' }),
    addressDetail: z.string().nullable().optional().openapi({ description: '오프라인일 경우 장소 상세 주소' }),
    streamingType: z
      .string()
      .nullable()
      .optional()
      .openapi({ description: '온라인일 경우 스트리밍 플랫폼 종류(youtube, zoom 등)' }),
    streamingUrl: z.string().nullable().optional().openapi({ description: '온라인일 경우 스트리밍 URL' }),
  })
  .openapi({ description: '이벤트 그룹 정보' });
export type EventGroupSchema = z.infer<typeof EventGroupSchema>;

export const EventGroupWithStatsSchema = EventGroupSchema.extend({
  currentCount: z.number().openapi({ description: '현재 신청 인원 수' }),
});
export type EventGroupWithStatsSchema = z.infer<typeof EventGroupWithStatsSchema>;

export const EventGroupListSchema = z
  .object({
    data: z.array(EventGroupWithStatsSchema),
    totalCounts: z.number().openapi({ description: '전체 이벤트 그룹 수' }),
  })
  .openapi({ description: '이벤트 그룹 리스트' });
export type EventGroupListSchema = z.infer<typeof EventGroupListSchema>;

export const GetEventGroupListParamsSchema = BasicGetListSchema.extend({
  eventId: z.string().optional().openapi({ description: '이벤트 ID로 필터링' }),
  recruitStatus: z.enum(['open', 'full', 'waiting', 'all']).optional().openapi({ description: '모집 상태' }),
  type: EventType.optional().openapi({ description: '이벤트 타입' }),
  isPaid: z
    .string()
    .optional()
    .openapi({ description: '유료 여부 (true/false)' }),
  isFirstCome: z
    .string()
    .optional()
    .openapi({ description: '선착순 여부 (true/false)' }),
  isPublic: z
    .string()
    .optional()
    .openapi({ description: '공개 여부 (true/false)' }),
});
export type GetEventGroupListParamsSchema = z.infer<typeof GetEventGroupListParamsSchema>;

export const CreateEventGroupSchema = EventGroupSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    startAt: z.string().openapi({ description: '이벤트 시작일시 (ISO 8601)' }),
    endAt: z.string().openapi({ description: '이벤트 종료일시 (ISO 8601)' }),
    applyStart: z.string().openapi({ description: '이벤트 신청 시작일시 (ISO 8601)' }),
    applyEnd: z.string().openapi({ description: '이벤트 신청 종료일시 (ISO 8601)' }),
  })
  .openapi({ description: '이벤트 그룹 생성' });
export type CreateEventGroupSchema = z.infer<typeof CreateEventGroupSchema>;

export const UpdateEventGroupSchema = CreateEventGroupSchema.openapi({ description: '이벤트 그룹 수정' });
export type UpdateEventGroupSchema = z.infer<typeof UpdateEventGroupSchema>;

export const DeleteEventGroupsSchema = z
  .object({
    ids: z
      .array(z.string().openapi({ description: '이벤트 그룹 ID' }))
      .openapi({ description: '삭제할 이벤트 그룹 ID 목록' }),
  })
  .openapi({
    description: '이벤트 그룹 삭제 요청',
  });
export type DeleteEventGroupsSchema = z.infer<typeof DeleteEventGroupsSchema>;
