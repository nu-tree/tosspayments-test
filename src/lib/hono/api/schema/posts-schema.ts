import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';
import { CreateCommentSchema } from './comment-schema';

export const PostsSchema = z
  .object({
    id: z.string().openapi({ description: '게시글 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    deletedAt: z.string().nullable().openapi({ description: '삭제일시' }),
    isSecret: z.boolean().openapi({ description: '비밀글 여부' }),
    password: z.string().nullable().openapi({ description: '비밀글 비밀번호' }),
    title: z.string().openapi({ description: '게시글 제목' }),
    content: z.string().openapi({ description: '게시글 내용' }),
    username: z.string().nullable().openapi({ description: '작성자 이름' }),
    userId: z.string().nullable().openapi({ description: '작성자 ID' }),
    boardId: z.string().openapi({ description: '게시판 ID' }),
    thumbnail: z.string().nullable().openapi({ description: '썸네일 URL' }),
    isDraft: z.boolean().openapi({ description: '임시저장 여부' }),
    attachments: z.string().array().openapi({ description: '첨부파일 목록' }),
    board: z
      .object({
        id: z.string().openapi({ description: '게시판 ID' }),
        slug: z.string().openapi({ description: '게시판 슬러그' }),
        title: z.string().openapi({ description: '게시판 제목' }),
      })
      .nullable()
      .openapi({ description: '게시판 정보' }),
    comments: z.array(CreateCommentSchema).optional().default([]).openapi({ description: '댓글 목록' }),
  })
  .openapi({
    description: '게시글 정보',
  });

export type PostsSchema = z.infer<typeof PostsSchema>;

export const PostsListSchema = z
  .object({
    data: z.array(PostsSchema),
    totalCounts: z.number().openapi({ description: '전체 게시글 수' }),
  })
  .openapi({
    description: '게시글 목록',
  });

export type PostsListSchema = z.infer<typeof PostsListSchema>;

export const GetPostListParamsSchema = BasicGetListSchema.extend({
  boardId: z.string().optional().openapi({ description: '게시판 ID 필터' }),
  isSecret: z.string().optional().openapi({ description: '비밀글 여부 필터' }),
});

export const CreatePostsSchema = PostsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  username: true,
  userId: true,
  board: true,
})
  .extend({
    isDraft: z.boolean().optional().openapi({ description: '임시저장 여부' }),
    isSecret: z.boolean().optional().openapi({ description: '비밀글 여부' }),
    thumbnail: z.string().optional().nullable().openapi({ description: '썸네일 파일 또는 URL' }),
    password: z.string().optional().nullable().openapi({ description: '비밀글 비밀번호' }),
    comments: z.array(CreateCommentSchema).optional().openapi({ description: '댓글 목록' }),
    attachments: z.array(z.string()).optional().openapi({ description: '첨부파일 목록' }),
  })
  .openapi({
    description: '게시글 생성 요청',
  });
export type CreatePostsSchema = z.infer<typeof CreatePostsSchema>;

export const UpdatePostsSchema = CreatePostsSchema.openapi({
  description: '게시글 수정 요청',
});
export type UpdatePostsSchema = z.infer<typeof UpdatePostsSchema>;

export const DeletePostsSchema = z
  .object({
    ids: z.array(z.string().openapi({ description: '게시글 ID' })).openapi({ description: '삭제할 게시글 ID 목록' }),
  })
  .openapi({
    description: '게시글 삭제 요청',
  });
export type DeletePostsSchema = z.infer<typeof DeletePostsSchema>;
