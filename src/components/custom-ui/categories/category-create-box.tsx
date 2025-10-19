'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/custom/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CategoryCreateShema = z.object({
  name: z.string().min(1, { message: '카테고리 이름을 입력해주세요.' }),
});

type CategoryCreateType = z.infer<typeof CategoryCreateShema>;

export const CategoryCreateBox = () => {
  const { success, error } = useToast();
  const [selectedCategoryId] = useQueryState('selected-category-id', parseAsInteger);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreateType>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(CategoryCreateShema),
  });

  const onSubmit = async (data: CategoryCreateType) => {
    console.log('새 카테고리 생성: ', data.name);
    console.log('선택된 부모 카테고리 ID: ', selectedCategoryId || '없음');
  };

  return (
    <form className="px-2 py-1" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid space-y-2">
        <legend>새 카테고리 추가</legend>
        <div className="space-y-1">
          <Input {...register('name')} placeholder="카테고리 이름" />
          <p className="text-sm text-red-500">{errors.name?.message}</p>
        </div>
        <Button className="w-12 justify-self-end">추가</Button>
      </fieldset>
    </form>
  );
};
