import { z } from '@hono/zod-openapi';

export const InquiryMetaSchema = z
  .object({
    id: z.string().openapi({ description: '문의 메타 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    slug: z.string().openapi({ description: '문의 메타 슬러그' }),
    title: z.string().openapi({ description: '문의 메타 제목' }),
    managerName: z.string().optional().openapi({ description: '담당자 이름' }),
    managerMail: z.string().optional().openapi({ description: '담당자 이메일' }),
  })
  .openapi({
    description: '문의 메타 정보',
  });
export type InquiryMetaSchema = z.infer<typeof InquiryMetaSchema>;

export const InquiryMetaListSchema = z
  .object({
    data: z.array(InquiryMetaSchema),
    totalCounts: z.number().openapi({ description: '전체 문의 메타 수' }),
  })
  .openapi({
    description: '문의 메타 목록',
  });
export type InquiryMetaListSchema = z.infer<typeof InquiryMetaListSchema>;

export const InquiryMetaSlugsSchema = InquiryMetaSchema.pick({ id: true, title: true, slug: true }).array().openapi({
  description: '문의 메타 슬러그 목록',
});
export type InquiryMetaSlugsSchema = z.infer<typeof InquiryMetaSlugsSchema>;

export const CreateInquiryMetaSchema = InquiryMetaSchema.pick({
  slug: true,
  title: true,
  managerName: true,
  managerMail: true,
}).openapi({
  description: '문의 메타 생성 요청',
});
export type CreateInquiryMetaSchema = z.infer<typeof CreateInquiryMetaSchema>;

export const UpdateInquiryMetaSchema = CreateInquiryMetaSchema.openapi({
  description: '문의 메타 수정 요청',
});
export type UpdateInquiryMetaSchema = z.infer<typeof UpdateInquiryMetaSchema>;

export const DeleteInquiryMetaSchema = z
  .object({
    ids: z
      .array(z.string().openapi({ description: '문의 메타 ID' }))
      .openapi({ description: '삭제할 문의 메타 ID 목록' }),
  })
  .openapi({
    description: '문의 메타 삭제 요청',
  });
export type DeleteInquiryMetaSchema = z.infer<typeof DeleteInquiryMetaSchema>;
