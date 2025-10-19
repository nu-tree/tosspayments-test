import { z } from '@hono/zod-openapi';

const MenuAuthEnum = z.enum(['ALL', 'MEMBER', 'ADMIN', 'SELLER', 'LEADER']).openapi({
  description: '메뉴 권한',
  example: 'ALL',
});
export type MenuAuthEnum = z.infer<typeof MenuAuthEnum>;

const MenuStatusEnum = z.enum(['ACTIVE', 'INACTIVE']).openapi({
  description: '메뉴 상태',
  example: 'ACTIVE',
});
export type MenuStatusEnum = z.infer<typeof MenuStatusEnum>;

const MenuTargetEnum = z.enum(['BLANK', 'SELF', 'PARENT', 'TOP']).openapi({
  description: '메뉴 타겟',
  example: 'SELF',
});
export type MenuTargetEnum = z.infer<typeof MenuTargetEnum>;

// 메뉴 스키마
export const MenuSchema = z
  .object({
    id: z.number().openapi({ description: '메뉴 ID', example: 1 }),
    createdAt: z.string().openapi({ description: '생성일시', example: '2024-01-01T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ description: '수정일시', example: '2024-01-01T00:00:00.000Z' }),
    deletedAt: z.string().nullable().openapi({ description: '삭제일시', example: null }),
    parentId: z.number().nullable().openapi({ description: '부모 메뉴 ID', example: null }),
    menuCategory: z
      .string()
      .min(1, '카테고리를 입력해주세요')
      .openapi({ description: '메뉴 카테고리', example: 'GNB' }),
    menuAuth: MenuAuthEnum.openapi({ description: '메뉴 권한', example: 'ALL' }),
    menuStatus: MenuStatusEnum.openapi({ description: '메뉴 상태', example: 'ACTIVE' }),
    menuTarget: MenuTargetEnum.openapi({ description: '메뉴 타겟', example: 'SELF' }),
    menuOrder: z.number().openapi({ description: '메뉴 순서', example: 1 }),
    menuName: z.string().min(1, '메뉴명을 입력해주세요').openapi({ description: '메뉴명', example: '홈' }),
    menuLink: z.string().openapi({ description: '메뉴 링크', example: '/' }),
  })
  .openapi({
    description: '메뉴 정보',
    example: {
      id: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      deletedAt: null,
      parentId: null,
      menuCategory: 'GNB',
      menuAuth: 'ALL',
      menuStatus: 'ACTIVE',
      menuOrder: 1,
      menuName: '홈',
      menuLink: '/',
      menuTarget: 'SELF',
    },
  });
export type MenuSchema = z.infer<typeof MenuSchema>;

// 메뉴 목록 스키마
export const MenuListSchema = z
  .object({
    data: z.array(MenuSchema),
    totalCounts: z.number().openapi({ description: '전체 메뉴 수', example: 10 }),
  })
  .openapi({
    description: '메뉴 목록',
    example: {
      data: [],
      totalCounts: 0,
    },
  });
export type MenuListSchema = z.infer<typeof MenuListSchema>;

// 메뉴 생성 스키마
// omit 무시할 필드를 지정
export const CreateMenuSchema = MenuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).openapi({
  description: '메뉴 생성 요청',
  example: {
    parentId: null,
    menuCategory: 'GNB',
    menuAuth: 'ALL',
    menuStatus: 'ACTIVE',
    menuOrder: 1,
    menuName: '홈',
    menuLink: '/',
    menuTarget: 'SELF',
  },
});
export type CreateMenuSchema = z.infer<typeof CreateMenuSchema>;

// 메뉴 업데이트 스키마
export const UpdateMenuSchema = CreateMenuSchema.openapi({
  description: '메뉴 수정 요청',
});
export type UpdateMenuSchema = z.infer<typeof UpdateMenuSchema>;

// 메뉴 삭제 스키마
export const DeleteMenuSchema = z
  .object({
    ids: z
      .array(z.number().openapi({ description: '메뉴 ID', example: 1 }))
      .openapi({ description: '삭제할 메뉴 ID 목록' }),
  })
  .openapi({
    description: '메뉴 삭제 요청',
    example: {
      ids: [1, 2, 3],
    },
  });
export type DeleteMenuSchema = z.infer<typeof DeleteMenuSchema>;

// 메뉴 순서 변경 스키마
export const ReOrderMenuSchema = z
  .object({
    selectedNodeId: z.number().openapi({ description: '선택된 노드 ID', example: 1 }),
    selectedNodeParentId: z.number().nullable().openapi({ description: '선택된 노드의 부모 ID', example: null }),
    selectedNodeOrder: z.number().openapi({ description: '선택된 노드의 순서', example: 1 }),
    targetNodeId: z.number().openapi({ description: '대상 노드 ID', example: 2 }),
    targetNodeParentId: z.number().nullable().openapi({ description: '대상 노드의 부모 ID', example: null }),
    targetNodeOrder: z.number().openapi({ description: '대상 노드의 순서', example: 2 }),
  })
  .openapi({
    description: '메뉴 순서 변경 요청',
    example: {
      selectedNodeId: 1,
      selectedNodeParentId: null,
      selectedNodeOrder: 1,
      targetNodeId: 2,
      targetNodeParentId: null,
      targetNodeOrder: 2,
    },
  });
export type ReOrderMenuSchema = z.infer<typeof ReOrderMenuSchema>;

export const GetMenusListParamsSchema = z
  .object({
    category: z.string().optional().openapi({ description: '카테고리' }),
  })
  .openapi({
    description: '기본 목록 조회 파라미터',
  });

export const GetMenusListParamsSchemaShape = GetMenusListParamsSchema.shape;
export type GetMenusListParamsSchemaType = z.infer<typeof GetMenusListParamsSchema>;
