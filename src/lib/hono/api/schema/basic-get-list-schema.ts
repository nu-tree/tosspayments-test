import { z } from '@hono/zod-openapi';

export const BasicGetListSchema = z
  .object({
    limit: z.coerce.number().optional().default(10).openapi({ description: '페이지당 아이템 수' }),
    offset: z.coerce.number().optional().default(1).openapi({ description: '페이지 번호' }),
    keyword: z.string().optional().openapi({ description: '검색 키워드' }),
    keywordName: z.string().optional().openapi({ description: '검색 키워드 이름' }),
  })
  .openapi({
    description: '기본 리스트 조회 파라미터',
  });

export const BasicGetListSchemaShape = BasicGetListSchema.shape;
export type BasicGetListSchemaType = z.infer<typeof BasicGetListSchema>;
