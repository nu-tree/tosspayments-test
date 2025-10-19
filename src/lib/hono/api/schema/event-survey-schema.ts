import { z } from '@hono/zod-openapi';

// 설문조사 시점 열거형
export const SurveyTimingType = z
  .enum(['BEFORE', 'AFTER'])
  .openapi({ description: 'BEFORE-이벤트 전 설문조사, AFTER-이벤트 후 설문조사' });
export type SurveyTimingType = z.infer<typeof SurveyTimingType>;

// 질문 타입 열거형
export const SurveyQuestionType = z.enum(['TEXT', 'CHOICE']).openapi({ description: 'TEXT-주관식, CHOICE-객관식' });
export type SurveyQuestionType = z.infer<typeof SurveyQuestionType>;

// 설문조사
export const EventSurveySchema = z.object({
  id: z.string().openapi({ description: '설문조사 ID' }),
  createdAt: z.date().openapi({ description: '생성일시' }),
  updatedAt: z.date().openapi({ description: '수정일시' }),
  timingType: SurveyTimingType,
  title: z.string().nullable().optional().openapi({ description: '설문조사 제목' }),
  description: z.string().nullable().optional().openapi({ description: '설문조사 설명' }),
  isPublished: z.boolean().default(false).openapi({ description: '설문조사 공개 여부. 비공개시 사용자는 답변 불가' }),
  eventId: z.string().openapi({ description: '설문조사가 등록된 이벤트 ID' }),
});
export type EventSurveySchema = z.infer<typeof EventSurveySchema>;

// 설문조사 질문
export const EventSurveyQuestionSchema = z.object({
  id: z.string().openapi({ description: '설문조사 질문 ID' }),
  content: z.string().openapi({ description: '질문 내용' }),
  type: SurveyQuestionType,
  isRequired: z.boolean().openapi({ description: '필수 답변 여부' }),
  order: z.number().openapi({ description: '질문 순서' }),
  maxSelections: z
    .number()
    .nullable()
    .optional()
    .openapi({ description: '객관식 질문에서 선택 가능한 최대 선택지 수' }),
  choiceOptions: z.string().nullable().optional().openapi({ description: '객관식일 경우 선택지 데이터 json으로 저장' }),
  surveyId: z.string().openapi({ description: '설문조사 ID' }),
});
export type EventSurveyQuestionSchema = z.infer<typeof EventSurveyQuestionSchema>;
// 설문조사 상세 조회(질문만 조회)
export const GetDetailEventSurveySchema = EventSurveySchema.extend({
  questions: z.array(EventSurveyQuestionSchema).openapi({ description: '설문조사 질문 목록' }),
}).openapi({ description: '설문조사 상세' });
export type GetDetailEventSurveySchema = z.infer<typeof GetDetailEventSurveySchema>;

// 관리자가 설문지 생성
export const CreateSurveySchema = EventSurveySchema.pick({
  timingType: true,
  title: true,
  description: true,
  isPublished: true,
})
  .extend({
    questions: z
      .array(EventSurveyQuestionSchema.omit({ id: true, surveyId: true }))
      .openapi({ description: '설문조사 질문 목록' }),
  })
  .openapi({ description: '설문조사 생성' });
export type CreateSurveySchema = z.infer<typeof CreateSurveySchema>;
// 관리자가 설문지 수정
export const UpdateSurveySchema = CreateSurveySchema;
export type UpdateSurveySchema = z.infer<typeof UpdateSurveySchema>;

// 설문조사 상태 변경 (공개/비공개)
export const ToggleSurveyStatusSchema = z
  .object({
    id: z.string().openapi({ description: '설문조사 ID' }),
  })
  .openapi({ description: '설문조사 공개/비공개 변경' });
export type ToggleSurveyStatusSchema = z.infer<typeof ToggleSurveyStatusSchema>;

// 각 질문에 대한 답변 스키마
export const SurveyAnswerSchema = z
  .object({
    id: z.string().openapi({ description: '답변 ID' }),
    createdAt: z.date().openapi({ description: '답변일시' }),
    userId: z.string().openapi({ description: '답변자 ID' }),
    surveyId: z.string().openapi({ description: '설문조사 ID' }),
    questionId: z.string().openapi({ description: '질문 ID' }),
    textAnswer: z.string().nullable().optional().openapi({ description: '주관식 답변' }),
    choiceAnswer: z.string().nullable().optional().openapi({ description: '객관식 답변 (JSON 형태)' }),
  })
  .openapi({ description: '각 질문에 대한 답변' });
export type SurveyAnswerSchema = z.infer<typeof SurveyAnswerSchema>;

// 설문조사 답변 생성(사용자가 설문조사에 답변)
export const CreateSurveyResponseSchema = z
  .object({
    surveyId: z.string().openapi({ description: '설문조사 ID' }),
    answers: z.array(SurveyAnswerSchema.omit({ id: true, userId: true, surveyId: true, createdAt: true })),
  })
  .openapi({ description: '설문조사 답변 생성' });
export type CreateSurveyResponseSchema = z.infer<typeof CreateSurveyResponseSchema>;
// 설문조사 답변 수정
export const UpdateSurveyResponseSchema = CreateSurveyResponseSchema;
export type UpdateSurveyResponseSchema = z.infer<typeof UpdateSurveyResponseSchema>;

// 사용자별 설문조사 답변 조회 요청
export const GetUserSurveyResponseParamsSchema = SurveyAnswerSchema.pick({
  userId: true,
  surveyId: true,
}).openapi({ description: '사용자별 설문조사 답변 조회 요청' });
export type GetUserSurveyResponseParamsSchema = z.infer<typeof GetUserSurveyResponseParamsSchema>;
// 사용자별 설문조사 답변 조회 결과
export const GetUserSurveyResponseSchema = z
  .object({
    survey: GetDetailEventSurveySchema, // 설문조사 정보 + 질문들
    response: z.array(SurveyAnswerSchema).nullable().optional(), // 사용자 답변
  })
  .openapi({ description: '사용자별 설문조사 답변 조회 결과' });
export type GetUserSurveyResponseSchema = z.infer<typeof GetUserSurveyResponseSchema>;

// 한 설문조사에 대한 모든 사용자의 답변 조회 결과(관리자용)
export const GetAllSurveyResponsesSchema = z
  .object({
    survey: GetDetailEventSurveySchema, // 설문조사 정보 + 질문들
    responses: z.array(SurveyAnswerSchema).openapi({ description: '모든 사용자 답변 목록' }),
  })
  .openapi({ description: '설문조사에 대한 모든 사용자 답변 조회 결과 (관리자용)' });
export type GetAllSurveyResponsesSchema = z.infer<typeof GetAllSurveyResponsesSchema>;
