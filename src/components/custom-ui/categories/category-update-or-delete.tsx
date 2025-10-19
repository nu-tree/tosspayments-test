'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/custom/use-toast';
import { asyncConfirm } from '@/components/custom-ui/designed-confirm/designed-confirm.hook';

type Category = {
  id: number;
  name: string;
};

type Props = React.HTMLAttributes<HTMLElement> & {
  category: Category;
};

export const CategoryUpdateOrDelete = ({ category, className }: Readonly<Props>) => {
  const [categoryName, setCategoryName] = useState('');
  const { error, success } = useToast();
  useEffect(() => {
    setCategoryName(category.name);
  }, [category]);

  const onUpdate = async () => {
    console.log('카테고리 수정: ', category.id, categoryName);
  };

  const onDelete = async () => {
    console.log('카테고리 삭제: ', category.id);
  };

  return (
    <div className={cn('flex flex-wrap items-end gap-2 border-b p-4', className)}>
      <Input
        className="text-primary w-35 font-bold"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <div className="mb-1 text-sm">상품 목록</div>
      <div className="ml-2 space-x-2">
        <Button className="min-w-0 px-2" onClick={onUpdate}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="destructive" className="min-w-0 px-2" onClick={onDelete}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
};
