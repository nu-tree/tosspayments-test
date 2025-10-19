import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';
import { ChannelSchema } from './channel-schema';

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
    isPublic: z.boolean().nullable().optional().openapi({ description: '공개 여부' }),
    isFirstCome: z
      .boolean()
      .nullable()
      .optional()
      .openapi({ description: 'true는 선착순 모집, false는 담당자가 신청자 중 참여자를 직접 선택' }),
    companionCnt: z.number().nullable().optional().openapi({ description: '참여자가 동반 가능한 인원 수' }),
    allowOverflow: z
      .boolean()
      .nullable()
      .optional()
      .openapi({ description: 'true는 모집 정원 초과 해도 신청 가능(대기자 모집) false는 정원 초과시 신청 마감' }),
    startAt: z.string().openapi({ description: '이벤트 시작일시' }),
    endAt: z.string().openapi({ description: '이벤트 종료일시' }),
    applyStart: z.string().openapi({ description: '이벤트 신청 시작일시' }),
    applyEnd: z.string().openapi({ description: '이벤트 신청 종료일시' }),
    type: EventType,
    address: z.string().nullable().optional().openapi({ description: '오프라인일 경우 장소 주소' }),
    addressDetail: z.string().nullable().optional().openapi({ description: '오프라인일 경우 장소 상세 주소' }),
    streamingType: z
      .string()
      .nullable()
      .optional()
      .openapi({ description: '온라인일 경우 스트리밍 플랫폼 종류(youtube, zoom 등)' }),
    streamingUrl: z.string().nullable().optional().openapi({ description: '온라인일 경우 스트리밍 URL' }),
    availableSlots: z.number().optional().nullable().openapi({ description: '남은 접수 자리 수 (무제한인 경우 -1)' }),
  })
  .openapi({ description: '이벤트 그룹 정보' });
export type EventGroupSchema = z.infer<typeof EventGroupSchema>;

export const EventSchema = z
  .object({
    id: z.string().openapi({ description: '이벤트 ID' }),
    createdAt: z.date().openapi({ description: '생성일시' }),
    updatedAt: z.date().openapi({ description: '수정일시' }),
    viewCount: z.number().openapi({ description: '이벤트 페이지 조회수' }),
    title: z.string().openapi({ description: '이벤트 제목' }),
    thumbnail: z.string().openapi({ description: '이벤트 썸네일 URL' }),
    summary: z.string().openapi({ description: '100자 이내 짧은 설명 문구' }),
    detail: z.string().openapi({ description: '이벤트 상세 내용 (html)' }),
    applicationUrl: z
      .string()
      .nullable()
      .optional()
      .openapi({ description: '사이트 내에서 신청하지 않고 외부사이트로 연결하는 경우' }),
    isPublic: z.boolean().openapi({ description: '공개 여부' }),
    channelId: z.string().openapi({ description: '이벤트를 등록한 채널 ID' }),
  })
  .openapi({ description: '이벤트 정보' });
export type EventSchema = z.infer<typeof EventSchema>;

export const EventDetailSchema = EventSchema.extend({
  eventGroups: z.array(EventGroupSchema).openapi({ description: '이벤트 그룹 리스트' }),
  channel: z.lazy(() => ChannelSchema).openapi({ description: '이벤트를 등록한 채널 정보' }),
});
export type EventDetailSchema = z.infer<typeof EventDetailSchema>;

export const EventListSchema = z
  .object({
    data: z.array(
      EventSchema.extend({
        eventGroups: z.array(EventGroupSchema).openapi({ description: '이벤트 그룹 리스트' }),
      }),
    ),
    totalCounts: z.number().openapi({ description: '전체 이벤트 수' }),
  })
  .openapi({ description: '이벤트 리스트' });
export type EventListSchema = z.infer<typeof EventListSchema>;

export const EventAtPlatformSchema = EventSchema.extend({
  ...EventGroupSchema.pick({
    isPaid: true,
    price: true,
    type: true,
    address: true,
    applyEnd: true,
    applyStart: true,
  }).shape,
  availableSlots: z.number().openapi({ description: '남은 접수 자리 수 (무제한인 경우 -1)' }),
});
export type EventAtPlatformSchema = z.infer<typeof EventAtPlatformSchema>;

export const EventListAtPlatformSchema = z.object({
  data: z.array(EventAtPlatformSchema),
  totalCounts: z.number().openapi({ description: '전체 이벤트 수' }),
});
export type EventListAtPlatformSchema = z.infer<typeof EventListAtPlatformSchema>;

export const GetEventListParamsSchema = BasicGetListSchema.extend({
  title: z.string().optional().openapi({ description: '이벤트 제목으로 필터링' }),
  isPublic: z.boolean().optional().openapi({ description: '공개 여부로 필터링' }),
  channelId: z.string().optional().openapi({ description: '채널 ID로 필터링' }),
  date: z.string().optional().openapi({ description: '날짜 검색 (YYYY-MM-DD)' }),
  dateEnd: z.string().optional().openapi({ description: '종료 날짜 (기간 검색시, YYYY-MM-DD)' }),
  type: EventType,
  isPaid: z.boolean().optional().openapi({ description: '유료/무료 필터링' }),
});
export type GetEventListParamsSchema = z.infer<typeof GetEventListParamsSchema>;

export const GetEventListAtPlatformParamsSchema = BasicGetListSchema.extend({
  q: z.string().optional().openapi({ description: '이벤트 이름 검색어' }),
  date: z.string().optional().openapi({ description: '날짜 검색' }),
  category: z.string().optional().openapi({ description: '카테고리 필터링' }),
  type: z.string().optional().openapi({ description: '이벤트 타입 필터링' }),
  participationMethod: z.string().optional().openapi({ description: '참여 방법 필터링' }),
  isFreeOnly: z.boolean().optional().openapi({ description: '무료 이벤트만 필터링' }),
});
export type GetEventListAtPlatformParamsSchema = z.infer<typeof GetEventListAtPlatformParamsSchema>;

export const CreateEventSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
})
  .extend({
    eventGroups: z
      .array(
        EventGroupSchema.omit({ createdAt: true, updatedAt: true, eventId: true }).extend({
          id: z.string().optional(),
        }),
      )
      .openapi({ description: '이벤트 그룹 리스트' }),
  })
  .openapi({ description: '이벤트 생성' });
export type CreateEventSchema = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema;
export type UpdateEventSchema = z.infer<typeof UpdateEventSchema>;

export const EvnetToggleVisibilitySchema = z.object({
  isPublic: z.boolean().openapi({ description: '공개 여부' }),
});
export type EvnetToggleVisibilitySchema = z.infer<typeof EvnetToggleVisibilitySchema>;
