'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarMonth } from 'react-day-picker';

type CustomCaptionProps = {
  calendarMonth: CalendarMonth;
  displayIndex: number;
  onMonthChange?: (date: Date) => void;
};

export default function CustomCaption({ calendarMonth, onMonthChange }: CustomCaptionProps) {
  // calendarMonth.date로 접근해야 함
  const displayMonth = calendarMonth.date;

  const [selectedMonth, setSelectedMonth] = useState(displayMonth.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(displayMonth.getFullYear().toString());

  // 연도 범위 (현재 연도 ±5년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => (currentYear - i).toString());

  // 월 데이터
  const months = [
    { value: '0', label: '1월' },
    { value: '1', label: '2월' },
    { value: '2', label: '3월' },
    { value: '3', label: '4월' },
    { value: '4', label: '5월' },
    { value: '5', label: '6월' },
    { value: '6', label: '7월' },
    { value: '7', label: '8월' },
    { value: '8', label: '9월' },
    { value: '9', label: '10월' },
    { value: '10', label: '11월' },
    { value: '11', label: '12월' },
  ];

  // displayMonth가 변경되면 선택된 값도 업데이트
  useEffect(() => {
    setSelectedMonth(displayMonth.getMonth().toString());
    setSelectedYear(displayMonth.getFullYear().toString());
  }, [displayMonth]);

  // 월 변경 핸들러
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const newDate = new Date(displayMonth);
    newDate.setMonth(parseInt(value));
    onMonthChange?.(newDate);
  };

  // 연도 변경 핸들러
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(value));
    onMonthChange?.(newDate);
  };

  return (
    <div className="z-10 mx-auto flex w-fit items-center justify-center gap-2">
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="h-8 w-21 border-none shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="h-8 w-20 border-none shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
