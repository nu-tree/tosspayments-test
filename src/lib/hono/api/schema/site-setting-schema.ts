import { z } from '@hono/zod-openapi';

export const SiteSettingKeySchema = z
  .enum([
    'analytics_google',
    'analytics_naver',
    'google_site_verification',
    'naver_site_verification',
    'seo_title',
    'seo_description',
    'seo_keywords',
    'seo_og_image',
  ])
  .openapi({
    description: '사이트 설정 키',
    example: 'seo_title',
  });

export type SiteSettingKey = z.infer<typeof SiteSettingKeySchema>;

export const SiteSettingParamsSchema = z
  .object({
    key: SiteSettingKeySchema,
  })
  .openapi({
    description: '사이트 설정 파라미터',
  });

export const SiteSettingSchema = z
  .object({
    key: SiteSettingKeySchema,
    id: z.string().openapi({ description: '설정 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    value: z.string().openapi({ description: '설정 값' }),
  })
  .openapi({
    description: '사이트 설정 정보',
  });
export type SiteSettingSchema = z.infer<typeof SiteSettingSchema>;

export const UpdateSiteSettingBodySchema = z
  .object({
    value: z.string().openapi({ description: '설정 값' }),
  })
  .openapi({
    description: '사이트 설정 수정 요청',
  });
export type UpdateSiteSettingSchema = z.infer<typeof UpdateSiteSettingBodySchema>;

export const SiteSettingListSchema = z.array(SiteSettingSchema).openapi({
  description: '사이트 설정 목록',
});
