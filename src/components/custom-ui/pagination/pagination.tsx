'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Pagination as ShadcnPagenation,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/custom-ui/pagination/prototype-pagination';

type Props = {
  totalCount: number;
  pageSize?: number;
  pagesPerView?: number;
};

export const Pagenation = ({ totalCount, pageSize = 10, pagesPerView = 5 }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startPage = Math.floor((currentPage - 1) / pagesPerView) * pagesPerView + 1;
  const endPage = Math.min(startPage + pagesPerView - 1, totalPages);

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <ShadcnPagenation>
        <PaginationContent>
          <PaginationItem className={cn('cursor-pointer', currentPage <= 1 && 'cursor-not-allowed opacity-50')}>
            <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
          </PaginationItem>

          {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
            const pageNum = startPage + index;
            return (
              <PaginationItem key={pageNum} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    currentPage === pageNum ? 'font-bold text-blue-500' : 'text-gray-700 hover:text-blue-500',
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem
            className={cn('cursor-pointer', currentPage >= totalPages && 'cursor-not-allowed opacity-50')}
          >
            <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagenation>
    </div>
  );
};
