'use client';

import { Calendar } from '@/components/ui/calendar';
import CustomCaption from './custom-caption';
import { DateRange, DayPickerProps, OnSelectHandler } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type CustomCalendarProps = Omit<DayPickerProps, 'components'> & {
  selected: DateRange | undefined;
  onSelect: OnSelectHandler<DateRange>;
  onMonthChange?: (month: Date) => void;
  className?: string;
  mode?: 'range';
  required: true;
};

export default function CustomCalendar(props: CustomCalendarProps) {
  const { onMonthChange, className, ...restProps } = props;
  const [month, setMonth] = useState(() => props.defaultMonth ?? new Date());

  return (
    <Calendar
      mode={'range' as const}
      captionLayout="dropdown"
      month={month}
      onMonthChange={setMonth}
      components={{
        MonthCaption: ({ calendarMonth, displayIndex }) => (
          <CustomCaption calendarMonth={calendarMonth} displayIndex={displayIndex} onMonthChange={setMonth} />
        ),
      }}
      className={cn(className, 'min-w-65')}
      {...restProps}
    />
  );
}
