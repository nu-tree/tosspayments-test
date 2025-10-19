import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/custom-ui/select/select';
import { Pxs } from '../plugin/tiptap-font-config/constants';
import { cn } from '@/lib/utils';
import { Type } from 'lucide-react';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { IconButton } from './common/icon-button';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const TipTapFontSize = ({ className, editor }: Readonly<Props>) => {
  const [currentFontSize, setCurrentFontSize] = useState<string>('18px');

  const getCurrentFontSize = useCallback(() => {
    if (!editor) return '18px';

    const fontSize = editor.getAttributes('textStyle').fontSize;

    // fontSize가 있고 Pxs enum에 포함된 값인지 확인
    if (fontSize && Object.values(Pxs).includes(fontSize as Pxs)) {
      return fontSize;
    }

    // 기본값 반환
    return '18px';
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      setCurrentFontSize(getCurrentFontSize());
    };

    // 에디터 업데이트 시 현재 폰트 크기 업데이트
    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);

    // 초기 폰트 크기 설정
    updateFontSize();

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor, getCurrentFontSize]);

  const changeFontSize = (size: Pxs) => {
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <div className={cn('', className)}>
      {/* 폰트 크기 설정 메뉴 */}
      <Select value={currentFontSize} onValueChange={changeFontSize}>
        <SelectTrigger
          className={cn(
            'group w-fit border-none shadow-none focus:ring-0 focus:outline-none',
            'flex cursor-pointer items-center rounded-md border border-gray-200 bg-white transition-colors hover:bg-gray-100',
            // 모바일: 컴팩트한 크기, 아이콘만
            'gap-0.5 px-1 lg:gap-1.5 lg:px-2',
            className,
          )}
        >
          <IconButtonWrapper className="p-1 lg:p-2">
            <IconButton>
              <Type className="h-3 w-3 lg:h-4 lg:w-4" />
            </IconButton>
          </IconButtonWrapper>
          {/* 데스크톱에서만 텍스트 표시 */}
          <div className="hidden lg:block">
            <SelectValue placeholder={currentFontSize} className="text-xs text-gray-700 lg:text-sm" />
          </div>
        </SelectTrigger>
        <SelectContent className="mt-1 h-72 w-32 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {Object.values(Pxs).map((px) => (
            <SelectItem
              key={px}
              value={px}
              className="cursor-pointer rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100"
            >
              {px}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
