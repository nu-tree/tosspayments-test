'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
// import 'react-day-picker/style.css';
import { ko } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/custom-ui/select/select';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = DayPickerProps;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <div className={cn('rounded-lg bg-white p-4 shadow-md dark:bg-gray-900', className)}>
      <DayPicker
        locale={ko} // 한글 로케일
        captionLayout="dropdown"
        showOutsideDays={showOutsideDays}
        classNames={{
          root: 'relative', // root 전체 부모요소
          weekday: 'font-extrabold pt-4 text-xl', // 월화수목금토일
          today: 'text-defult/90 bg-default/10 bg-secondary-foreground/30 rounded-full',
          selected: 'text-primary rounded-full bg-primary-foreground/30',
          outside: 'text-gray-400',
          day: 'text-center hover:bg-default/10 h-10 rounded-full hover:scale-105 transition-transform duration-500 ease-in-out transform hover:rounded-lg transition-all duration-300 ease-in-out',
          day_button: 'w-full h-full ',
          month_caption: 'flex', // 년, 월 날짜 선택
          month_grid: 'w-full',
          months: 'w-full',
          nav: 'absolute right-0',
          dropdowns: 'flex gap-2 flex-row-reverse',
          ...classNames,
        }}
        components={{
          Button: ({ className, ...props }) => (
            <button
              {...props}
              className={cn(buttonVariants({ variant: 'outline' }), 'hover:bg-gray-100', className)}
            ></button>
          ),
          Chevron: (props) => {
            if (props.orientation === 'left') {
              return <ChevronLeft {...props} />;
            }
            return <ChevronRight {...props} />;
          },
          YearsDropdown(props) {
            const { value, options, onChange } = props;
            return (
              <Select
                value={value?.toString()}
                onValueChange={(newValue: string) => {
                  // onChange가 있으면, 이를 ChangeEvent 형태로 변환해서 호출
                  if (onChange) {
                    onChange({
                      target: {
                        value: newValue,
                      },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }
                }}
              >
                <SelectTrigger className="border-primary-foreground/50 border text-lg">
                  <SelectValue placeholder="년도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((year) => (
                    <SelectItem key={year.value} value={`${year.value}`}>
                      {`${year.label}년`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
          MonthsDropdown(props) {
            const { value, options, onChange } = props;
            return (
              <Select
                value={`${value}`}
                onValueChange={(newValue: string) => {
                  // onChange가 있으면, 이를 ChangeEvent 형태로 변환해서 호출
                  if (onChange) {
                    onChange({
                      target: {
                        value: newValue,
                      },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }
                }}
              >
                <SelectTrigger className="border-primary-foreground/50 border text-lg">
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((month) => (
                    <SelectItem key={month.value} value={`${month.value}`}>
                      {`${month.label}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
