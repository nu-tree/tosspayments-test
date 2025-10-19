import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { TipTapFontStyle } from '../menus/font-style';
import { Separator } from '../menus/common/separator';
import { TipTapFontSize } from '../menus/font-size';
import { TipTapFontColor } from '../menus/font-color';
import { Highlight } from '../menus/highlight';
import { Bold } from '../menus/bold';
import { Italic } from '../menus/italic';
import { UnderLine } from '../menus/underline';
import { Strike } from '../menus/strike';
import { UrlLink } from '../menus/url-link';
import { TextAlignLeft } from '../menus/text-align-left';
import { TextAlignCenter } from '../menus/text-align-center';
import { TextAlignRight } from '../menus/text-align-right';
import { Img } from '../menus/img';
import { Table } from '../menus/table';
import { Editor } from '@tiptap/core';
import { ChevronDown, ChevronUp, Bold as BoldIcon, AlignCenter, Palette } from 'lucide-react';
import { YoutubeLink } from '../menus/youtube-link';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string>;
};

export const Toolbar = ({ className, editor, onImageUpload }: Readonly<Props>) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    text: false,
    align: false,
    color: false,
  });

  const toolbarRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => {
      // 다른 그룹이 열려있으면 모두 닫고 현재 그룹만 토글
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = key === groupName ? !prev[groupName] : false;
      });
      return newState;
    });
  };

  // 외부 클릭 시 모든 그룹 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenGroups((prev) => {
          const newState: Record<string, boolean> = {};
          Object.keys(prev).forEach((key) => {
            newState[key] = false;
          });
          return newState;
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const GroupButton = ({ groupName, icon: Icon }: { groupName: string; icon: React.ElementType }) => (
    <div className="relative">
      <button
        onClick={() => toggleGroup(groupName)}
        className="flex items-center rounded-md bg-white p-1 transition-colors hover:bg-gray-100"
      >
        <Icon className="h-4 w-4" />
        {openGroups[groupName] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {/* 펼쳐지는 메뉴 - 위에 뜨게 */}
      {openGroups[groupName] && (
        <div className="absolute bottom-full left-1/2 z-10 mb-1 flex -translate-x-1/2 transform items-center gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          {groupName === 'text' && (
            <>
              <Bold editor={editor} />
              <Italic editor={editor} />
              <UnderLine editor={editor} />
              <Strike editor={editor} />
            </>
          )}
          {groupName === 'align' && (
            <>
              <TextAlignLeft editor={editor} />
              <TextAlignCenter editor={editor} />
              <TextAlignRight editor={editor} />
            </>
          )}
          {groupName === 'color' && (
            <>
              <TipTapFontColor editor={editor} />
              <Highlight editor={editor} />
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('border-b', className)} ref={toolbarRef}>
      {/* 데스크톱: 1줄 레이아웃 (lg 이상) */}
      <div className="hidden items-center px-4 py-1 lg:flex">
        <TipTapFontStyle editor={editor} />
        <Separator />
        <TipTapFontSize editor={editor} />
        <Separator />
        <TipTapFontColor editor={editor} />
        <Highlight editor={editor} />
        <Separator />
        <Bold editor={editor} />
        <Italic editor={editor} />
        <UnderLine editor={editor} />
        <Strike editor={editor} />
        <UrlLink editor={editor} />
        <Separator />
        <Table editor={editor} />
        <Separator />
        <TextAlignLeft editor={editor} />
        <TextAlignCenter editor={editor} />
        <TextAlignRight editor={editor} />
        <Separator />
        <Img editor={editor} onImageUpload={onImageUpload} />
        <Separator />
        <YoutubeLink editor={editor} />
      </div>

      {/* 모바일/태블릿: 그룹별 접기/펴기 레이아웃 (lg 미만) */}
      <div className="p-2 lg:hidden">
        <div className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* 폰트 스타일 그룹: 항상 표시 */}
          <TipTapFontStyle editor={editor} />
          <TipTapFontSize editor={editor} />
          {/* 서식 그룹 - Bold 아이콘 사용 */}
          <GroupButton groupName="text" icon={BoldIcon} />
          {/* 정렬 그룹 - TextAlignCenter 아이콘 사용 */}
          <GroupButton groupName="align" icon={AlignCenter} />
          {/* 색상 그룹 - Palette 아이콘 사용 */}
          <GroupButton groupName="color" icon={Palette} />
          {/* 나머지는 일단 직접 배치 */}
          <UrlLink editor={editor} />
          <Table editor={editor} />
          <Img editor={editor} onImageUpload={onImageUpload} />
          <YoutubeLink editor={editor} />
        </div>
      </div>
    </div>
  );
};
