import React, { useRef } from 'react';
import AccordionTree, { TreeProps } from './accordion-tree';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export type TreeCardProps = TreeProps & {
  title?: string;
  height?: string;
  width?: string;
  className?: string;
  onSelectPath?: (path: string[]) => void;
};

export default function TreeCard({
  title = '카테고리 목록',
  height = '200px',
  width = '400px',
  className,
  ...props
}: TreeCardProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="size-fit rounded-md border">
      <div className={cn('py-1 px-2 mb-2 bg-gray-100 border-b-1 text-lg')}>{title}</div>
      <ScrollArea ref={parentRef} style={{ height: height, width: width }} className={cn('bg-transparent', className)}>
        <AccordionTree {...props} />
      </ScrollArea>
    </div>
  );
}
