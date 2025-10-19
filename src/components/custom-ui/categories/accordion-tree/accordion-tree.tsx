'use client';

import React, { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { Folders, CornerDownRight } from 'lucide-react';
import { AccordionContent, AccordionTrigger } from './accordion-components';
import { toast } from 'sonner';
import { useQueryState } from 'nuqs';

export type TreeNode = {
  id: string;
  code: string;
  name: string;
  children?: TreeNode[];
  createdAt: Date;
  parentId?: number | null;
  updatedAt: Date;
};

export type TreeProps = {
  data: TreeNode[];
  maxDepth?: number; // 최대 깊이 설정, 기본값은 5
  onMove: (itemId: string, newParentId: string | null) => Promise<boolean | void> | boolean | void;
  onSelectPath?: (path: string[]) => void;
};

function AccordionTree({ data, maxDepth = 5, onMove, onSelectPath }: TreeProps) {
  // 클릭한 요소
  const [select, setSelect] = useQueryState('selected-category-id');
  // 현재 드래그 중인 아이템 ID
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  // 현재 드래그 중인 아이템이 지나가는 아이템 ID
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // depth 계산 함수
  const calculateDepth = (itemId: string): number => {
    const findDepth = (items: TreeNode[], targetId: string, currentDepth: number = 1): number => {
      for (const item of items) {
        if (item.id === targetId) return currentDepth;
        if (item.children) {
          const found = findDepth(item.children, targetId, currentDepth + 1);
          if (found !== -1) return found;
        }
      }
      return -1;
    };
    return findDepth(data, itemId);
  };

  const findPathById = (tree: TreeNode[], id: string, path: string[] = []): string[] | null => {
    for (const node of tree) {
      const newPath = [...path, node.name];
      if (node.id === id) return newPath;
      if (node.children) {
        const found = findPathById(node.children, id, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  // 아이템 클릭시 url 쿼리 적용
  const onClick = (item: TreeNode) => {
    if (select === item.id) {
      setSelect(null);
      onSelectPath?.([]);
    } else {
      setSelect(item.id);
      const path = findPathById(data, item.id) ?? [];
      onSelectPath?.(path);
    }
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    if (!draggedItem) return;
    e.preventDefault();

    // 자기 자신이나 자신의 하위 항목으로는 드롭 불가
    if (draggedItem === itemId || isDescendant(draggedItem, itemId)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    // 최하위 항목(5단계 항목)에는 드롭 불가
    const targetDepth = calculateDepth(itemId);
    if (targetDepth >= maxDepth) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // 자식 요소로 이동하는 경우가 아닐 때만 dragOverItem 초기화
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, newParentId: string | null) => {
    if (!draggedItem || !onMove) return;
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중단

    // 자기 자신이나 자신의 하위 항목으로는 드롭 불가
    if (draggedItem === newParentId || (newParentId && isDescendant(draggedItem, newParentId))) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    // 최하위 항목에는 드롭 불가
    if (newParentId) {
      const newDepth = calculateDepth(newParentId) + 1;
      if (newDepth > maxDepth) {
        toast.error(`최대 ${maxDepth} 단계까지만 분류를 생성할 수 있습니다.`);
        setDraggedItem(null);
        setDragOverItem(null);
        return;
      }
    }

    try {
      await onMove(draggedItem, newParentId);
    } catch (error) {
      console.error('Move failed:', error);
    } finally {
      setDraggedItem(null);
      setDragOverItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 루트 영역에 드롭 처리 (최상위로 이동)
  const handleRootDrop = (e: React.DragEvent) => {
    if (!draggedItem) return;

    // 이미 다른 아이템에 드롭된 경우 무시
    if (dragOverItem) return;

    e.preventDefault();
    handleDrop(e, null);
  };

  const handleRootDragOver = (e: React.DragEvent) => {
    if (!draggedItem) return;

    // 다른 아이템 위에 있는 경우 루트 드래그오버 무시
    if (dragOverItem) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 특정 아이템이 다른 아이템의 하위인지 확인하는 헬퍼 함수
  const isDescendant = (ancestorId: string, descendantId: string): boolean => {
    const findInTree = (items: TreeNode[], targetId: string): TreeNode | null => {
      for (const item of items) {
        if (item.id === targetId) return item;
        if (item.children) {
          const found = findInTree(item.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const ancestor = findInTree(data, ancestorId);
    if (!ancestor || !ancestor.children) return false;

    const checkChildren = (children: TreeNode[]): boolean => {
      for (const child of children) {
        if (child.id === descendantId) return true;
        if (child.children && checkChildren(child.children)) return true;
      }
      return false;
    };

    return checkChildren(ancestor.children);
  };

  const renderTreeItems = (items: TreeNode[], parentId: string | null = null, currentDepth: number = 1) => {
    return (
      <>
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isMaxDepth = currentDepth >= maxDepth; // 5단계까지만 허용
          return (
            <li key={item.id}>
              <AccordionPrimitive.Root type="single" collapsible>
                <AccordionPrimitive.Item value="item-1">
                  <div className="w-full flex justify-between items-center group hover:bg-neutral-100 mr-4 rounded-md bg-">
                    <AccordionTrigger
                      className={cn(
                        'flex-1 text-sm',
                        select === item.id ? 'bg-accent' : '',
                        draggedItem === item.id ? 'opacity-50' : '',
                        // 최하위 항목(5단계 항목)에는 드래그 오버 스타일 미적용
                        dragOverItem === item.id && currentDepth < maxDepth
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : '',
                        dragOverItem === item.id && currentDepth >= maxDepth ? 'bg-red-50 border-2 border-red-300' : ''
                      )}
                      onClick={() => onClick(item)}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(e, item.id);
                      }}
                      hideChevron={isMaxDepth || !hasChildren}
                      onDragEnd={handleDragEnd}
                      disabled={isMaxDepth && !hasChildren} // 최대 depth에서 하위요소 없으면 비활성화
                    >
                      {hasChildren || currentDepth === 1 ? (
                        <Folders className="size-5 shrink-0 mr-3" aria-hidden="true" />
                      ) : (
                        <CornerDownRight className={cn('size-5 shrink-0 mr-3')} aria-hidden="true" />
                      )}

                      <div className="flex-1 flex items-center">{item.name}</div>
                    </AccordionTrigger>
                  </div>

                  {/* 최대 depth가 아닐 때만 AccordionContent 렌더링 */}
                  {!isMaxDepth && (
                    <AccordionContent className="pl-4">
                      <ul role="list" className="space-y-1">
                        {hasChildren && renderTreeItems(item.children!, item.id, currentDepth + 1)}
                      </ul>
                    </AccordionContent>
                  )}
                </AccordionPrimitive.Item>
              </AccordionPrimitive.Root>
            </li>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full" onDrop={handleRootDrop} onDragOver={handleRootDragOver}>
      <ul role="list" className="space-y-1 pr-2">
        {renderTreeItems(data, null, 1)} {/* 초기 depth는 1 */}
      </ul>
      {true && (
        <div className="mt-4 mx-4 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
          드래그하여 분류를 이동하세요. <br />
          최상위로 이동하려면 빈 공간에 드롭하세요.
        </div>
      )}
    </div>
  );
}

export default AccordionTree;
