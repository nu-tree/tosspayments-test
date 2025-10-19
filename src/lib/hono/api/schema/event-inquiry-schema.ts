import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from '@/lib/hono/api/schema/basic-get-list-schema';

/**
 * 이벤트 문의 답변 스키마
 */
export const EventInquiryAnswerSchema = z
  .object({
    id: z.string().openapi({ description: '답변 ID' }),
    createdAt: z.coerce.date().openapi({ description: '생성일시' }),
    updatedAt: z.coerce.date().openapi({ description: '수정일시' }),
    content: z.string().openapi({ description: '답변 내용' }),
    answererName: z.string().nullable().openapi({ description: '답변자 이름' }),
    userId: z.string().nullable().openapi({ description: '답변자 ID' }),
    eventInquiryId: z.string().openapi({ description: '이벤트 문의 ID' }),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .optional()
      .openapi({ description: '답변자 정보' }),
  })
  .openapi('EventInquiryAnswer');

export type EventInquiryAnswerSchema = z.infer<typeof EventInquiryAnswerSchema>;

/**
 * 이벤트 문의 스키마
 */
export const EventInquirySchema = z
  .object({
    id: z.string().openapi({ description: '문의 ID' }),
    createdAt: z.coerce.date().openapi({ description: '생성일시' }),
    updatedAt: z.coerce.date().openapi({ description: '수정일시' }),
    content: z.string().openapi({ description: '문의 내용' }),
    writerName: z.string().nullable().openapi({ description: '작성자 이름' }),
    writerEmail: z.string().nullable().openapi({ description: '작성자 이메일' }),
    writerContact: z.string().nullable().openapi({ description: '작성자 연락처' }),
    isSecret: z.boolean().default(false).openapi({ description: '비밀문의 여부' }),
    isAnswered: z.boolean().default(false).openapi({ description: '답변 여부' }),
    eventId: z.string().openapi({ description: '이벤트 ID' }),
    userId: z.string().nullable().openapi({ description: '작성자 사용자 ID' }),
    EventInquiryAnswer: z.array(EventInquiryAnswerSchema).optional().openapi({ description: '답변 목록' }),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .optional()
      .openapi({ description: '작성자 정보' }),
    event: z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .optional()
      .openapi({ description: '이벤트 정보' }),
  })
  .openapi('EventInquiry');

export type EventInquirySchema = z.infer<typeof EventInquirySchema>;

/**
 * 이벤트 문의 목록 응답
 */
export const EventInquiryListSchema = z
  .object({
    data: z.array(EventInquirySchema),
    totalCounts: z.number().openapi({ description: '전체 문의 수' }),
  })
  .openapi('EventInquiryList');

export type EventInquiryListSchema = z.infer<typeof EventInquiryListSchema>;

/**
 * 문의 목록 조회 쿼리 파라미터
 */
export const GetEventInquiryListParamsSchema = BasicGetListSchema.extend({
  eventId: z.string().openapi({ description: '이벤트 ID (필수)', example: 'event-123' }),
  isAnswered: z.string().optional().openapi({ description: '답변 여부 필터 (true/false)', example: 'true' }),
  isSecret: z.string().optional().openapi({ description: '비밀문의 필터 (true/false)', example: 'false' }),
});

export type GetEventInquiryListParamsSchema = z.infer<typeof GetEventInquiryListParamsSchema>;

/**
 * 문의 생성 요청
 */
export const CreateEventInquirySchema = z
  .object({
    eventId: z.string().openapi({ description: '이벤트 ID' }),
    content: z.string().min(1).openapi({ description: '문의 내용' }),
    isSecret: z.boolean().default(false).openapi({ description: '비밀문의 여부' }),
    secretPassword: z.string().optional().openapi({ description: '비밀문의 비밀번호 (비회원 전용)' }),
    writerName: z.string().optional().openapi({ description: '작성자 이름 (비회원 전용)' }),
    writerEmail: z.string().optional().openapi({ description: '작성자 이메일 (비회원 전용)' }),
    writerContact: z.string().optional().openapi({ description: '작성자 연락처 (비회원 전용)' }),
  })
  .openapi('CreateEventInquiry');

export type CreateEventInquirySchema = z.infer<typeof CreateEventInquirySchema>;

/**
 * 문의 수정 요청
 */
export const UpdateEventInquirySchema = z
  .object({
    content: z.string().min(1).optional().openapi({ description: '문의 내용' }),
    isSecret: z.boolean().optional().openapi({ description: '비밀문의 여부' }),
  })
  .openapi('UpdateEventInquiry');

export type UpdateEventInquirySchema = z.infer<typeof UpdateEventInquirySchema>;

/**
 * 문의 삭제 요청
 */
export const DeleteEventInquirySchema = z
  .object({
    ids: z.array(z.string()).min(1).openapi({ description: '삭제할 문의 ID 목록' }),
  })
  .openapi('DeleteEventInquiry');

export type DeleteEventInquirySchema = z.infer<typeof DeleteEventInquirySchema>;

/**
 * 비밀번호 검증 요청
 */
export const VerifySecretPasswordSchema = z
  .object({
    inquiryId: z.string().openapi({ description: '문의 ID' }),
    password: z.string().openapi({ description: '비밀번호' }),
  })
  .openapi('VerifySecretPassword');

export type VerifySecretPasswordSchema = z.infer<typeof VerifySecretPasswordSchema>;

/**
 * 비밀번호 검증 응답
 */
export const VerifySecretPasswordResponseSchema = z
  .object({
    verified: z.boolean().openapi({ description: '검증 성공 여부' }),
  })
  .openapi('VerifySecretPasswordResponse');

export type VerifySecretPasswordResponseSchema = z.infer<typeof VerifySecretPasswordResponseSchema>;

/**
 * 답변 생성 요청
 */
export const CreateEventInquiryAnswerSchema = z
  .object({
    eventInquiryId: z.string().openapi({ description: '이벤트 문의 ID' }),
    content: z.string().min(1).openapi({ description: '답변 내용' }),
    answererName: z.string().optional().openapi({ description: '답변자 이름' }),
  })
  .openapi('CreateEventInquiryAnswer');

export type CreateEventInquiryAnswerSchema = z.infer<typeof CreateEventInquiryAnswerSchema>;

/**
 * 답변 수정 요청
 */
export const UpdateEventInquiryAnswerSchema = z
  .object({
    content: z.string().min(1).openapi({ description: '답변 내용' }),
    answererName: z.string().optional().openapi({ description: '답변자 이름' }),
  })
  .openapi('UpdateEventInquiryAnswer');

export type UpdateEventInquiryAnswerSchema = z.infer<typeof UpdateEventInquiryAnswerSchema>;

/**
 * 답변 삭제 응답
 */
export const DeleteEventInquiryAnswerResponseSchema = z
  .object({
    message: z.string().openapi({ description: '삭제 결과 메시지' }),
  })
  .openapi('DeleteEventInquiryAnswerResponse');

export type DeleteEventInquiryAnswerResponseSchema = z.infer<typeof DeleteEventInquiryAnswerResponseSchema>;
