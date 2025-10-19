'use client';

import * as React from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

type Option = {
  value: string;
  label?: string;
};

type AddableComboboxProps = {
  value?: string; // 현재 선택된 값
  onChange?: (value: string, isNew?: boolean) => void; // 값 변경 핸들러 - (value, isNew) 형태로 호출

  options: Option[]; // 선택 가능한 옵션 목록
  allowCreate?: boolean; // 새 값 추가 허용 여부 (기본: true)
  placeholder?: string; // placeholder 텍스트

  emptyText?: string; // 검색 결과가 없을 때 표시할 메시지
  disabled?: boolean; // 비활성화 상태

  className?: string; // 컨테이너 클래스명
  contentClassName?: string; // 콘텐츠 영역 클래스명
};

/**
 * 검색 가능한 콤보박스 컴포넌트
 * - 기존 옵션에서 선택하거나 새 값을 추가할 수 있음
 * - 검색 기능 내장
 * - onChange(value, isNew)로 신규 생성 여부 확인 가능
 */
export function AddableCombobox({
  value = '',
  onChange,
  options = [],
  allowCreate = true,
  placeholder = '검색 또는 선택...',
  emptyText = '결과가 없습니다.',
  disabled = false,
  className,
  contentClassName,
}: AddableComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  // 선택된 옵션 찾기 (기존 옵션 또는 새로 생성된 값)
  const selectedOption = React.useMemo(() => {
    if (!value || value.trim() === '') return null;

    // 기존 옵션에서 찾기
    const existingOption = options.find((option) => option.value === value);
    if (existingOption) return existingOption;

    // 새로 생성된 값인 경우 임시 옵션 객체 생성
    return { value, label: value };
  }, [value, options]);

  // 검색된 옵션 필터링
  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) return options;

    const query = inputValue.toLowerCase();
    return options.filter(
      (option) => option.label?.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
    );
  }, [inputValue, options]);

  // 중복 체크
  const isDuplicate = React.useMemo(() => {
    if (!inputValue.trim()) return true;
    return options.some(
      (option) =>
        option.value.toLowerCase() === inputValue.toLowerCase() ||
        option.label?.toLowerCase() === inputValue.toLowerCase(),
    );
  }, [inputValue, options]);

  const handleSelect = (selectedValue: string) => {
    if (onChange) onChange(selectedValue, false);
    setIsOpen(false);
    setInputValue('');
  };

  const handleClear = () => {
    if (onChange) onChange('', false);
  };

  const handleCreate = () => {
    const trimmed = inputValue.trim();
    if (!allowCreate || !trimmed || isDuplicate) return;

    if (onChange) onChange(trimmed, true);
    setInputValue('');
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setInputValue('');
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {selectedOption && (
              <div
                className="hover:bg-muted flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn('w-[--radix-popover-trigger-width] p-0', contentClassName)}>
        <Command shouldFilter={false}>
          <CommandInput placeholder={placeholder} value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">{emptyText}</CommandEmpty>

            {/* 기존 옵션들 */}
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedOption?.value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* 새 값 추가 */}
            {allowCreate && inputValue.trim() && !isDuplicate && (
              <>
                {filteredOptions.length > 0 && <CommandSeparator />}
                <CommandGroup>
                  <CommandItem value="__create__" onSelect={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>&quot;{inputValue.trim()}&quot; 추가</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// 타입 내보내기
export type { Option, AddableComboboxProps };
