import { z } from '@hono/zod-openapi';

export const CommentSchema = z
  .object({
    id: z.string().openapi({ description: '댓글 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    deletedAt: z.string().nullable().openapi({ description: '삭제일시' }),
    content: z.string().openapi({ description: '댓글 내용' }),
    postId: z.string().openapi({ description: '게시글 ID' }),
    username: z.string().nullable().openapi({ description: '작성자 이름' }),
    userId: z.string().nullable().openapi({ description: '작성자 ID' }),
    parentId: z.string().nullable().openapi({ description: '부모 댓글 ID' }),
  })
  .openapi({
    description: '댓글 정보',
  });

export type CommentSchema = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = CommentSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  id: z.string(),
  content: z.string(),
  deletedAt: z.string().nullable().optional(),
});
export type CreateCommentSchema = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = CreateCommentSchema.extend({});
export type UpdateCommentSchema = z.infer<typeof UpdateCommentSchema>;

export const DeleteCommentSchema = z.object({
  ids: z.array(z.string()),
});
