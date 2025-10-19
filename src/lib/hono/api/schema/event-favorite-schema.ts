import { z } from '@hono/zod-openapi';

/**
 * 관심 행사 스키마
 */
export const EventFavoriteSchema = z
  .object({
    id: z.string().openapi({ example: 'cm123abc' }),
    createdAt: z.string().openapi({ example: '2025-10-14T12:00:00.000Z' }),
    userId: z.string().openapi({ example: 'cm123user' }),
    eventId: z.string().openapi({ example: 'cm123event' }),
    event: z
      .object({
        id: z.string(),
        title: z.string(),
        thumbnail: z.string(),
        summary: z.string(),
        date: z.string().nullable(),
        location: z.string().nullable(),
      })
      .optional(),
  })
  .openapi('EventFavorite');

/**
 * 관심 행사 목록 스키마
 */
export const EventFavoriteListSchema = z
  .object({
    data: z.array(EventFavoriteSchema),
    totalCounts: z.number(),
  })
  .openapi('EventFavoriteList');

/**
 * 관심 행사 추가 요청 스키마
 */
export const CreateEventFavoriteParamsSchema = z.object({
  eventId: z.string().openapi({
    param: { name: 'eventId', in: 'path' },
    example: 'cm123event',
  }),
});

/**
 * 관심 행사 삭제 요청 스키마
 */
export const DeleteEventFavoriteParamsSchema = z.object({
  eventId: z.string().openapi({
    param: { name: 'eventId', in: 'path' },
    example: 'cm123event',
  }),
});

/**
 * 관심 행사 목록 조회 쿼리 스키마
 */
export const GetEventFavoriteListParamsSchema = z.object({
  limit: z.string().optional().openapi({ example: '10' }),
  offset: z.string().optional().openapi({ example: '1' }),
});

