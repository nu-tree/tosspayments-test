'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, formatISO, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useQueryState } from 'nuqs';
import CustomCalendar from './custom-calendar';
import { useCustomRangeCalendar } from '@/hooks/custom/use-custom-range-calendar';

export type RangeCalendarProps = {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  variant?: 'default' | 'primary' | 'secondary' | 'deepGreen' | 'destructive';
  placeholder?: string;
  disabled?: boolean;
  queryName?: string;
  resetKey?: number;
};

export const CustomRangeCalendar = ({
  value,
  onChange,
  variant = 'primary',
  placeholder = '날짜 설정',
  disabled = false,
  queryName = 'date-range',
  resetKey,
}: RangeCalendarProps) => {
  const [open, setOpen] = useState(false);
  const { date, setDate } = useCustomRangeCalendar(queryName);

  useEffect(() => {
    if (resetKey) {
      setDate(null);
    }
  }, [resetKey, setDate]);

  const controlled = value !== undefined && onChange !== undefined;
  const selected = controlled ? value : (date ?? undefined);
  const handleChange = controlled ? onChange : (v: DateRange | undefined) => setDate(v ?? null);

  const handleDateChange = (newValue: DateRange | undefined) => {
    // 시작날짜와 끝날짜가 모두 있을때: 새로운 시작날짜 설정
    if (selected?.from && selected?.to && newValue?.from && newValue?.to) {
      if (newValue.to.getTime() !== selected.to.getTime()) {
        handleChange?.({ from: newValue.to, to: undefined });
        return;
      }
    }
    // 아무것도 선택되지 않을 때: 시작날짜만 설정
    if (!selected?.from && !selected?.to && newValue?.from) {
      handleChange?.({ from: newValue.from, to: undefined });
      return;
    }

    handleChange?.(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('h-8 font-normal shadow-sm hover:bg-transparent')} disabled={disabled}>
          {selected?.from ? (
            selected.to ? (
              <>
                {format(selected.from, 'yyyy-MM-dd')} - {format(selected.to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(selected.from, 'yyyy-MM-dd')
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid w-auto p-0" align="start">
        <CustomCalendar
          locale={ko}
          mode="range"
          captionLayout="dropdown"
          defaultMonth={selected?.from}
          selected={selected}
          onSelect={handleDateChange}
          numberOfMonths={2}
          required
          disabled={disabled}
          classNames={{ dropdowns: 'flex flex-row-reverse gap-2 border-none [&>*]:border-none [&>*]:shadow-none' }}
        />
        <Button variant="outline" className="mr-2 mb-2 w-15 justify-self-end" onClick={() => setOpen(false)}>
          확인
        </Button>
      </PopoverContent>
    </Popover>
  );
};
