import { z } from '@hono/zod-openapi';

/**
 * 이벤트 후기 스키마
 */
export const EventReviewSchema = z
  .object({
    id: z.string().openapi({ description: '후기 ID' }),
    createdAt: z.coerce.date().openapi({ description: '생성일시' }),
    updatedAt: z.coerce.date().openapi({ description: '수정일시' }),
    rating: z.number().min(1).max(5).openapi({ description: '만족도 (1-5점)' }),
    content: z.string().openapi({ description: '후기 내용' }),
    eventId: z.string().openapi({ description: '이벤트 ID' }),
    groupId: z.string().openapi({ description: '그룹 ID' }),
    applicationId: z.string().openapi({ description: '신청 ID' }),
    // 프론트엔드용 (하드코딩)
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      })
      .optional()
      .openapi({ description: '작성자 정보 (하드코딩)' }),
    group: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional()
      .openapi({ description: '그룹 정보' }),
  })
  .openapi('EventReview');

export type EventReviewSchema = z.infer<typeof EventReviewSchema>;

/**
 * 후기 통계 스키마
 */
export const ReviewStatsSchema = z
  .object({
    totalReviews: z.number().openapi({ description: '총 후기 수' }),
    averageRating: z.number().openapi({ description: '평균 만족도' }),
    ratingDistribution: z
      .object({
        5: z.number(),
        4: z.number(),
        3: z.number(),
        2: z.number(),
        1: z.number(),
      })
      .openapi({ description: '만족도 분포' }),
    participantCount: z.number().openapi({ description: '참가자 수' }),
    reviewRate: z.number().openapi({ description: '후기 작성률 (%)' }),
  })
  .openapi('ReviewStats');

export type ReviewStatsSchema = z.infer<typeof ReviewStatsSchema>;

/**
 * 후기 목록 응답
 */
export const EventReviewListSchema = z
  .object({
    ok: z.boolean(),
    data: z.object({
      reviews: z.array(EventReviewSchema),
      stats: ReviewStatsSchema,
      total: z.number(),
    }),
  })
  .openapi('EventReviewList');

export type EventReviewListSchema = z.infer<typeof EventReviewListSchema>;

/**
 * 후기 통계 응답
 */
export const EventReviewStatsResponseSchema = z
  .object({
    ok: z.boolean(),
    data: ReviewStatsSchema,
  })
  .openapi('EventReviewStatsResponse');

export type EventReviewStatsResponseSchema = z.infer<typeof EventReviewStatsResponseSchema>;

/**
 * 목록 조회 쿼리 파라미터
 */
export const GetEventReviewListParamsSchema = z.object({
  eventId: z.string().openapi({ description: '이벤트 ID (필수)', example: 'event-123' }),
  groupId: z.string().optional().openapi({ description: '그룹 ID (선택, all이면 전체)', example: 'group-123' }),
  rating: z.string().optional().openapi({ description: '만족도 필터 (1-5)', example: '5' }),
  limit: z.string().optional().default('10').openapi({ description: '페이지당 항목 수', example: '10' }),
  offset: z.string().optional().default('0').openapi({ description: '오프셋', example: '0' }),
});

export type GetEventReviewListParamsSchema = z.infer<typeof GetEventReviewListParamsSchema>;

/**
 * 삭제 요청 바디
 */
export const DeleteEventReviewsSchema = z
  .object({
    reviewIds: z.array(z.string()).min(1).openapi({ description: '삭제할 후기 ID 목록' }),
  })
  .openapi('DeleteEventReviews');

export type DeleteEventReviewsSchema = z.infer<typeof DeleteEventReviewsSchema>;

/**
 * 삭제 응답
 */
export const DeleteEventReviewsResponseSchema = z
  .object({
    ok: z.boolean(),
    data: z.object({
      deletedCount: z.number(),
    }),
  })
  .openapi('DeleteEventReviewsResponse');

export type DeleteEventReviewsResponseSchema = z.infer<typeof DeleteEventReviewsResponseSchema>;
