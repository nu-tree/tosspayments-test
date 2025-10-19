import { z } from '@hono/zod-openapi';
import { BasicGetListSchema } from './basic-get-list-schema';

export const BannerDisplayTypeSchema = z.enum(['PC', 'MOBILE', 'ALL']).openapi({
  description: '배너 표시 타입',
  example: 'PC',
});
export type BannerDisplayTypeSchema = z.infer<typeof BannerDisplayTypeSchema>;

export const BannerItemSchema = z
  .object({
    id: z.string().openapi({ description: '배너 아이템 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    displayOrder: z.number().optional().openapi({ description: '표시 순서' }),
    startDate: z.string().optional().openapi({ description: '시작일' }),
    endDate: z.string().optional().openapi({ description: '종료일' }),
    imageUrl: z.string().openapi({ description: '이미지 URL' }),
    linkUrl: z.string().optional().openapi({ description: '링크 URL' }),
    displayType: BannerDisplayTypeSchema,
    bannerId: z.string().openapi({ description: '배너 ID' }),
  })
  .openapi({
    description: '배너 아이템 정보',
  });
export type BannerItemSchema = z.infer<typeof BannerItemSchema>;

export const BannersSchema = z
  .object({
    id: z.string().openapi({ description: '배너 ID' }),
    createdAt: z.string().openapi({ description: '생성일시' }),
    updatedAt: z.string().openapi({ description: '수정일시' }),
    slug: z.string().openapi({ description: '배너 슬러그' }),
    isView: z.boolean().optional().openapi({ description: '표시 여부' }),
    bannerWidth: z.number().optional().openapi({ description: '배너 너비' }),
    bannerHeight: z.number().optional().openapi({ description: '배너 높이' }),
    bannerItems: z.array(BannerItemSchema).optional().openapi({ description: '배너 아이템 목록' }),
  })
  .openapi({
    description: '배너 정보',
  });
export type BannersSchema = z.infer<typeof BannersSchema>;

export const BannerListSchema = z
  .object({
    data: z.array(BannersSchema),
    totalCounts: z.number().openapi({ description: '전체 배너 수' }),
  })
  .openapi({
    description: '배너 목록',
  });
export type BannerListSchema = z.infer<typeof BannerListSchema>;

export const GetBannerListParamsSchema = BasicGetListSchema.extend({
  isView: z.boolean().optional().openapi({ description: '표시 여부 필터' }),
});

export const CreateBannersSchema = BannersSchema.pick({
  slug: true,
  isView: true,
  bannerWidth: true,
  bannerHeight: true,
})
  .extend({
    bannerItems: z
      .array(
        BannerItemSchema.pick({
          displayOrder: true,
          linkUrl: true,
          displayType: true,
        }).extend({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          imageUrl: z.string(),
        }),
      )
      .optional(),
  })
  .openapi({
    description: '배너 생성 요청',
  });
export type CreateBannersSchema = z.infer<typeof CreateBannersSchema>;

export const UpdateBannersSchema = CreateBannersSchema.openapi({
  description: '배너 수정 요청',
});
export type UpdateBannersSchema = z.infer<typeof UpdateBannersSchema>;

export const DeleteBannersSchema = z
  .object({
    ids: z.array(z.string().openapi({ description: '배너 ID' })).openapi({ description: '삭제할 배너 ID 목록' }),
  })
  .openapi({
    description: '배너 삭제 요청',
  });
export type DeleteBannersSchema = z.infer<typeof DeleteBannersSchema>;
