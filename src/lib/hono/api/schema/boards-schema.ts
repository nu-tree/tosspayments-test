import { z } from '@hono/zod-openapi';

export const BoardRoleEnum = z.enum(['admin', 'user', 'guest']).openapi({
  description: '게시판 역할',
  example: 'user',
});

export const BoardFeatureSchema = z
  .object({
    role: z
      .object({
        edit: BoardRoleEnum,
        read: BoardRoleEnum,
        delete: BoardRoleEnum,
        comment: BoardRoleEnum,
      })
      .openapi({ description: '역할별 권한' }),
    attachment: z
      .object({
        maxCount: z.number().optional().openapi({ description: '최대 첨부파일 수' }),
        maxSize: z.number().optional().openapi({ description: '최대 파일 크기' }),
        allowTypes: z.array(z.string()).optional().openapi({ description: '허용 파일 타입' }),
      })
      .optional()
      .openapi({ description: '첨부파일 설정' }),
    comment: z
      .object({ maxDepth: z.number().optional().openapi({ description: '최대 댓글 깊이' }) })
      .optional()
      .openapi({ description: '댓글 설정' }),
    secret: z
      .object({ passwordRequired: z.boolean().optional().openapi({ description: '비밀번호 필수 여부' }) })
      .optional()
      .openapi({ description: '비밀글 설정' }),
    captcha: z.boolean().optional().openapi({ description: '캡차 사용 여부' }),
    thumbnail: z
      .object({
        width: z.number().optional().openapi({ description: '썸네일 너비' }),
        height: z.number().optional().openapi({ description: '썸네일 높이' }),
      })
      .optional()
      .openapi({ description: '썸네일 설정' }),
  })
  .openapi({
    description: '게시판 기능 설정',
  });

export const BoardsSchema = z
  .object({
    id: z.string().openapi({ description: '게시판 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    deletedAt: z.string().optional().nullable().openapi({ description: '삭제일시' }),
    slug: z.string().openapi({ description: '게시판 슬러그' }),
    title: z.string().openapi({ description: '게시판 제목' }),
    feature: BoardFeatureSchema,
  })
  .openapi({
    description: '게시판 정보',
  });

export type BoardsSchema = z.infer<typeof BoardsSchema>;

export const BoardsListSchema = z
  .object({
    data: z.array(BoardsSchema),
    totalCounts: z.number().openapi({ description: '전체 게시판 수' }),
  })
  .openapi({
    description: '게시판 목록',
  });

export type BoardsListSchema = z.infer<typeof BoardsListSchema>;

export const BoardsSlugsSchema = BoardsSchema.pick({ id: true, title: true, slug: true, feature: true })
  .array()
  .openapi({
    description: '게시판 슬러그 목록',
  });
export type BoardsSlugsSchema = z.infer<typeof BoardsSlugsSchema>;

export const CreateBoardsSchema = BoardsSchema.pick({
  title: true,
  feature: true,
})
  .extend({
    slug: z.string().regex(/^[A-Za-z _]+$/, {
      message: '영문자, 공백, 밑줄( _ )만 입력할 수 있습니다.',
    }),
    isThumbAble: z.boolean().optional().openapi({ description: '썸네일 사용 가능 여부' }),
    isAttachAble: z.boolean().optional().openapi({ description: '첨부파일 사용 가능 여부' }),
  })
  .openapi({
    description: '게시판 생성 요청',
  });

export type CreateBoardsSchema = z.infer<typeof CreateBoardsSchema>;

export const UpdateBoardsSchema = CreateBoardsSchema.openapi({
  description: '게시판 수정 요청',
});

export type UpdateBoardsSchema = z.infer<typeof UpdateBoardsSchema>;

export const DeleteBoardsSchema = z
  .object({
    ids: z.array(z.string().openapi({ description: '게시판 ID' })).openapi({ description: '삭제할 게시판 ID 목록' }),
  })
  .openapi({
    description: '게시판 삭제 요청',
  });

export type DeleteBoardsSchema = z.infer<typeof DeleteBoardsSchema>;
