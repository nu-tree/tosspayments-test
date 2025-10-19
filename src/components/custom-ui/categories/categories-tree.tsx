'use client';

import { Loader2 } from 'lucide-react';
import TreeCard from './accordion-tree/tree-card';

const dummyData = [
  {
    id: '1',
    code: 'A001',
    name: 'Root Node 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '1-1',
        code: 'A001-1',
        name: 'Child Node 1.1',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: 1,
        children: [
          {
            id: '1-1-1',
            code: 'A001-1-1',
            name: 'Grandchild Node 1.1.1',
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: 11, // Assuming parentId corresponds to the parent's id
          },
        ],
      },
      {
        id: '1-2',
        code: 'A001-2',
        name: 'Child Node 1.2',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: 1,
      },
    ],
  },
  {
    id: '2',
    code: 'B002',
    name: 'Root Node 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '2-1',
        code: 'B002-1',
        name: 'Child Node 2.1',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: 2,
      },
    ],
  },
  {
    id: '3',
    code: 'C003',
    name: 'Root Node 3 (No Children)',
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: null,
  },
];
const isLoading = false;

export default function CategoriesTree() {
  const onMove = async (itemId: string, targetId: string | null) => {
    if (itemId === targetId) return;
    console.log('아이템 이동', itemId, 'to', targetId);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <TreeCard data={dummyData ?? []} onMove={onMove} width="24rem" height="500px" />
      )}
    </div>
  );
}
