import { z } from '@hono/zod-openapi';

export const ReplySchema = z
  .object({
    id: z.string().openapi({ description: '답변 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    content: z.string().openapi({ description: '답변 내용' }),
    inquiryId: z.string().openapi({ description: '문의 ID' }),
    userId: z.string().openapi({ description: '사용자 ID' }),
    user: z
      .object({
        email: z.string().openapi({ description: '사용자 이메일' }),
        name: z.string().openapi({ description: '사용자 이름' }),
      })
      .optional()
      .openapi({ description: '사용자 정보' }),
  })
  .openapi({
    description: '답변 정보',
  });
export type ReplySchema = z.infer<typeof ReplySchema>;

export const CreateReplySchema = ReplySchema.pick({
  content: true,
  inquiryId: true,
}).openapi({
  description: '답변 생성 요청',
});
export type CreateReplySchema = z.infer<typeof CreateReplySchema>;

export const UpdateReplySchema = CreateReplySchema.openapi({
  description: '답변 수정 요청',
});
export type UpdateReplySchema = z.infer<typeof UpdateReplySchema>;

export const DeleteReplySchema = ReplySchema.pick({
  id: true,
  inquiryId: true,
}).openapi({
  description: '답변 삭제 요청',
});
export type DeleteReplySchema = z.infer<typeof DeleteReplySchema>;
