'use client';

import { Loader2 } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { CategoryUpdateOrDelete } from './category-update-or-delete';
// import { useInfiniteScroll } from '@/hooks/custom/use-infinite-scroll';

export default function CategoryItems() {
  // 선택된 경로와 일치하거나 하위에 포함되는 상품만 필터링
  const [selectedCategoryId] = useQueryState('selected-category-id', parseAsInteger);

  const products = [
    { id: 'p1', productName: '상품 1' },
    { id: 'p2', productName: '상품 2' },
    { id: 'p3', productName: '상품 3' },
  ];

  const category = { id: 1, name: '선택된 카테고리' };

  // 모든 페이지의 데이터를 하나로 합치기 (페이지 인덱스와 함께)
  // const products = data?.pages.flatMap((page, pageIndex) =>
  //   (page?.data?.data || []).map((product, productIndex) => ({
  //     ...product,
  //     uniqueKey: `${product.id}-page-${pageIndex}-index-${productIndex}`,
  //   }))
  // );

  return (
    <div className="border-primary-foreground row-span-2 flex h-[calc(100vh-238px)] flex-col border">
      {false ? (
        <div className="flex justify-center p-4">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <>
          <CategoryUpdateOrDelete category={category} />
          <div className="scrollbar-hide flex-1 overflow-y-auto">
            {products?.map((p) => (
              <div key={p.id} className="border-b p-3">
                {/* <p className="text-xs mb-1 text-muted-foreground">{p.category.join(' > ')}</p> */}

                <div
                  // className="cursor-pointer text-primary underline underline-offset-4 hover:text-primary/80"
                  className=""
                  // onClick={() => masterProductPopupOpen(p.id)}
                >
                  {p.productName}
                </div>
              </div>
            ))}

            {products?.length === 0 && !false && (
              <div className="text-muted-foreground p-3">해당 카테고리에 상품이 없습니다.</div>
            )}

            {/* 무한스크롤 트리거 요소 */}
            {/* {hasNextPage && (
              <div className="p-4 flex justify-center">
                {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  );
}
