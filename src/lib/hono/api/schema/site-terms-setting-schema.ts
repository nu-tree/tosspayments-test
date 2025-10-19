import { z } from '@hono/zod-openapi';

export const CreateSiteTermsSettingBodySchema = z
  .object({
    key: z.string().regex(/^[A-Za-z_]+$/, '영문과 밑줄(_)만 허용됩니다.'),
    value: z.string().openapi({ description: '약관 내용' }),
    name: z.string().optional().openapi({ description: '약관 이름' }),
  })
  .openapi({
    description: '사이트 약관 설정 생성 요청',
  });
export type CreateSiteTermsSettingBodySchema = z.infer<typeof CreateSiteTermsSettingBodySchema>;

export const SiteTermsSettingSchema = CreateSiteTermsSettingBodySchema.extend({
  id: z.string().openapi({ description: '약관 설정 ID' }),
  createdAt: z.string().openapi({ description: '생성일시' }),
}).openapi({
  description: '사이트 약관 설정 정보',
});
export type SiteTermsSettingSchema = z.infer<typeof SiteTermsSettingSchema>;

export const SiteTermsSettingListSchema = z.object({
  data: z.array(SiteTermsSettingSchema),
  totalCounts: z.number(),
});
export type SiteTermsSettingListSchema = z.infer<typeof SiteTermsSettingListSchema>;

export const DeleteSiteTermsSettingsSchema = z.object({
  ids: z.array(z.string()),
});
export type DeleteSiteTermsSettingsSchema = z.infer<typeof DeleteSiteTermsSettingsSchema>;
