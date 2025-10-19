import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from '@/lib/hono/api/schema/basic-get-list-schema';
import { ReplySchema } from './reply-schema';

export const InquirySchema = z
  .object({
    id: z.string().openapi({ description: '문의 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),

    title: z.string().openapi({ description: '문의 제목' }),
    content: z.string().openapi({ description: '문의 내용' }),
    isAnswered: z.boolean().default(false).openapi({ description: '답변 여부' }),
    inquiryMetaId: z.string().openapi({ description: '문의 메타 ID' }),
    userId: z.string().optional().openapi({ description: '사용자 ID' }),
    contact: z.string().optional().openapi({ description: '연락처' }),
    writer: z.string().optional().openapi({ description: '작성자 이름' }),
    isSecret: z.boolean().openapi({ description: '비밀문의 여부' }),
    reply: ReplySchema.nullable().optional().openapi({ description: '답변 정보' }),
    inquiryMeta: z
      .object({
        id: z.string().openapi({ description: '문의 메타 ID' }),
        title: z.string().openapi({ description: '문의 메타 제목' }),
        slug: z.string().openapi({ description: '문의 메타 슬러그' }),
      })
      .optional()
      .openapi({ description: '문의 메타 정보' }),
  })
  .openapi({
    description: '문의 정보',
  });
export type InquirySchema = z.infer<typeof InquirySchema>;

export const InquiryListSchema = z
  .object({
    data: z.array(InquirySchema),
    totalCounts: z.number().openapi({ description: '전체 문의 수' }),
  })
  .openapi({
    description: '문의 목록',
  });
export type InquiryListSchema = z.infer<typeof InquiryListSchema>;

export const GetInquiryListParamsSchema = BasicGetListSchema.extend({
  inquiryMetaId: z.string().optional().openapi({ description: '문의 메타 ID 필터' }),
  isAnswered: z.string().optional().openapi({ description: '답변 여부 필터' }),
});

export const GetInquiryListByUserLoggedInParamsSchema = BasicGetListSchema.extend({
  userId: z.string(),
});

export const GetInquiryListByUserLoggedOutParamsSchema = BasicGetListSchema.extend({
  contact: z.string(),
  writer: z.string(),
});

export const CreateInquirySchema = InquirySchema.pick({
  title: true,
  content: true,
  inquiryMetaId: true,
  contact: true,
  writer: true,
  isSecret: true,
}).openapi({
  description: '문의 생성 요청',
});
export type CreateInquirySchema = z.infer<typeof CreateInquirySchema>;

export const UpdateInquirySchema = CreateInquirySchema.openapi({
  description: '문의 수정 요청',
});
export type UpdateInquirySchema = z.infer<typeof UpdateInquirySchema>;

export const DeleteInquirySchema = z
  .object({
    ids: z.array(z.string().openapi({ description: '문의 ID' })).openapi({ description: '삭제할 문의 ID 목록' }),
  })
  .openapi({
    description: '문의 삭제 요청',
  });
export type DeleteInquirySchema = z.infer<typeof DeleteInquirySchema>;
