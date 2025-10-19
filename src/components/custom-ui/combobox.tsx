'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';

type ComboboxProps = {
  options: { value: string; label: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
};

export const Combobox = ({
  options,
  placeholder = '선택하세요',
  searchPlaceholder = '검색...',
  emptyText = '결과가 없습니다',
  className,
  onChange,
  defaultValue,
  value: externalValue,
}: ComboboxProps) => {
  const [value, setValue] = useState(defaultValue || externalValue || '');
  const [open, setOpen] = useState(false);

  const handleChange = (value: string) => {
    setValue(value);
    setOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  useEffect(() => {
    if (externalValue !== value) {
      setValue(externalValue || '');
      setOpen(false);
    }
  }, [externalValue, value]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('min-w-[200px] justify-between', className)}
        >
          <span className="truncate">{selectedOption ? `${placeholder} | ${selectedOption.label}` : placeholder}</span>
          <div className="ml-2 flex items-center gap-1">
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={handleChange}>
                  <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
