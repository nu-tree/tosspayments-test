import { z } from '@hono/zod-openapi';

export const PopupUnit = z.enum(['PX', 'PERCENT']);
export const PopupDisplayType = z.enum(['PC', 'MOBILE', 'ALL']);

export const PopupSchema = z
  .object({
    id: z.string().openapi({ description: '팝업 ID' }),
    createdAt: z.date().openapi({ description: '생성일시' }),
    updatedAt: z.date().openapi({ description: '수정일시' }),
    identifier: z.string().openapi({ description: '팝업 식별자' }),
    content: z.string().openapi({ description: '팝업 내용' }),
    linkUrl: z.string().optional().openapi({ description: '링크 URL' }),
    displayOrder: z.number().optional().openapi({ description: '표시 순서' }),
    startDate: z.string().openapi({ description: '표시 시작일' }),
    endDate: z.string().openapi({ description: '표시 종료일' }),
    topPosition: z.number().openapi({ description: '상단 위치' }),
    leftPosition: z.number().openapi({ description: '좌측 위치' }),
    topPositionUnit: PopupUnit,
    leftPositionUnit: PopupUnit,
    width: z.number().openapi({ description: '팝업 너비' }),
    height: z.number().openapi({ description: '팝업 높이' }),
    widthUnit: PopupUnit,
    heightUnit: PopupUnit,
    displayPages: z.string().optional().nullable(),
    displayType: PopupDisplayType,
  })
  .openapi({
    description: '팝업 정보',
  });
export type PopupSchema = z.infer<typeof PopupSchema>;

export const PopupListSchema = z
  .object({
    data: z.array(PopupSchema),
    totalCounts: z.number().openapi({ description: '전체 팝업 수' }),
  })
  .openapi({
    description: '팝업 목록',
  });
export type PopupListSchema = z.infer<typeof PopupListSchema>;

export const CreatePopupSchema = PopupSchema.pick({
  identifier: true,
  content: true,
  linkUrl: true,
  displayOrder: true,
  startDate: true,
  endDate: true,
  topPosition: true,
  leftPosition: true,
  topPositionUnit: true,
  leftPositionUnit: true,
  width: true,
  height: true,
  widthUnit: true,
  heightUnit: true,
  displayPages: true,
  displayType: true,
});
export type CreatePopupSchema = z.infer<typeof CreatePopupSchema>;

export const UpdatePopupSchema = CreatePopupSchema;
export type UpdatePopupSchema = z.infer<typeof UpdatePopupSchema>;

export const DeletePopupSchema = z
  .object({ ids: z.array(z.string()) })
  .openapi({
    description: '삭제할 팝업 ID 목록',
  })
  .openapi({ description: '팝업 삭제 요청' });
export type DeletePopupSchema = z.infer<typeof DeletePopupSchema>;
