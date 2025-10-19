import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/custom-ui/popover/popover';
import { Input } from '@/components/custom-ui/input/input';
import { Button } from '@/components/custom-ui/button/button';
import { cn } from '@/lib/utils';
import { Link } from 'lucide-react';
import { IconButton } from './common/icon-button';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const UrlLink = ({ className, editor }: Readonly<Props>) => {
  const [link, setLink] = useState<string>('');
  const [open, setOpen] = useState(false);

  if (!editor) return null;

  const handleLinkClick = () => {
    if (link) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
      setLink('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn('', className)}>
        <IconButtonWrapper data-state={open ? 'on' : 'off'}>
          <IconButton data-state={open ? 'on' : 'off'}>
            <Link />
          </IconButton>
        </IconButtonWrapper>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-6 rounded-2xl border border-gray-100 bg-white p-7 shadow-2xl">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900">링크 추가</h3>
          <p className="text-xs text-gray-500">연결할 웹사이트 주소를 입력하세요.</p>
        </div>
        <Input
          type="text"
          placeholder="https://example.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <Button
          onClick={handleLinkClick}
          disabled={!link}
          className={cn(
            'group mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <Link className="size-4 text-gray-400 transition-colors group-hover:text-gray-900" />
          <span>링크 추가</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
