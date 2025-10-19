import { z } from '@hono/zod-openapi';

// config 스키마
export const ConfigSchema = z
  .object({
    id: z.string().openapi({ description: '설정 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    deletedAt: z.string().nullable().openapi({ description: '삭제일시' }),
    title: z.string().openapi({ description: '설정 제목' }),
    key: z.string().openapi({ description: '설정 키' }),
    value: z.string().openapi({ description: '설정 값' }),
    category: z.string().openapi({ description: '설정 카테고리' }),
    description: z.string().nullable().openapi({ description: '설정 설명' }),
    isActive: z.boolean().openapi({ description: '활성화 여부' }),
    protected: z.boolean().openapi({ description: '보호 여부' }),
  })
  .openapi({
    description: '설정 정보',
  });
export type ConfigSchema = z.infer<typeof ConfigSchema>;

// config 리스트 스키마
export const ConfigListSchema = z.object({
  data: z.array(ConfigSchema),
  totalCounts: z.number(),
});
export type ConfigListSchema = z.infer<typeof ConfigListSchema>;

// config 생성(POST) 스키마
// omit 무시할 필드를 지정
export const CreateConfigSchema = ConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type CreateConfigSchema = z.infer<typeof CreateConfigSchema>;

// config 수정(PUT) 스키마
export const UpdateConfigSchema = CreateConfigSchema;
export type UpdateConfigSchema = z.infer<typeof UpdateConfigSchema>;

// config 삭제(DELETE) 스키마
export const DeleteConfigSchema = z.object({
  ids: z.array(z.string()),
});
export type DeleteConfigSchema = z.infer<typeof DeleteConfigSchema>;
