'use client';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, RotateCcw } from 'lucide-react';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import { cn } from '@/lib/utils';

type Props = {
  value?: Date | null;
  onSelect?: (date: Date | null) => void;
  placeholder?: string;
  mode?: 'date' | 'month'; // 새로운 mode prop 추가
  isResetable?: boolean; // 리셋 가능 여부
  className?: string;
};

export const PopoverCalendar = ({
  value,
  onSelect,
  className,
  placeholder,
  mode = 'date',
  isResetable = false,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const today = new Date();

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const handleSelect = (date: Date | null) => {
    setSelectedDate(date ? new Date(date) : null);
    onSelect?.(date);
    setIsOpen(false);
    setPopoverOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen); // 드롭다운 열기/닫기

  const handleYearSelect = (year: number) => {
    const updatedDate = new Date(selectedDate || today); // 새로운 Date 객체를 만들어서 수정
    updatedDate.setFullYear(year); // 연도 변경
    setSelectedDate(updatedDate); // 새로운 Date 객체로 상태 업데이트
    onSelect?.(updatedDate); // 변경된 날짜를 부모 컴포넌트로 전달
    setIsOpen(false); // 드롭다운 닫기
  };

  const handleMonthSelect = (month: number) => {
    const updatedDate = new Date(selectedDate || today);
    updatedDate.setMonth(month);
    setSelectedDate(updatedDate);
    onSelect?.(updatedDate);
    setIsMonthOpen(false);
  };

  // 월 모드일 때의 날짜 포맷
  const getDateFormat = () => {
    return mode === 'month' ? 'yyyy년 MM월' : 'yyyy년 MM월 dd일';
  };

  // 월 모드일 때의 placeholder
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return mode === 'month' ? '월 선택' : '날짜 선택';
  };

  // 월 모드용 커스텀 헤더
  const renderMonthCustomHeader = ({ date, decreaseYear, increaseYear, changeYear }: any) => {
    const currentYear = date.getFullYear();

    return (
      <div className="flex w-full items-center justify-between px-4 py-2">
        <ChevronLeftIcon
          size={20}
          onClick={decreaseYear}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
        />
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            <span>{currentYear}년</span>
          </div>
          {isOpen && (
            <div className="border-input absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
              {Array.from({ length: 150 }, (_, i) => today.getFullYear() - 150 + (i + 1))
                .reverse()
                .map((year) => (
                  <div
                    key={year}
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setFullYear(year);
                      setSelectedDate(newDate);
                      onSelect?.(newDate);
                      changeYear(year);
                      setIsOpen(false);
                    }}
                    className="hover:text-primary cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                  >
                    {year}년
                  </div>
                ))}
            </div>
          )}
        </div>
        <ChevronRightIcon
          size={20}
          onClick={increaseYear}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
        />
      </div>
    );
  };

  // 날짜 모드용 커스텀 헤더
  const renderDateCustomHeader = ({ date, decreaseMonth, increaseMonth, changeYear, changeMonth }: any) => (
    <div className="!grid w-[100%] grid-cols-[20px_160px_20px] tracking-normal">
      <ChevronLeftIcon size={20} onClick={decreaseMonth} className="cursor-pointer text-gray-500" />
      <div className="flex items-center space-x-2">
        {/* 연도 드롭다운 */}
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex w-[100px] cursor-pointer items-center justify-center rounded-lg bg-white px-3 py-1 text-[1.1rem] text-gray-800 hover:bg-gray-100"
          >
            <span>{(selectedDate ? new Date(selectedDate) : today).getFullYear()}년</span>
          </div>
          {isOpen && (
            <div className="border-input absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
              {Array.from({ length: 150 }, (_, i) => today.getFullYear() - 150 + (i + 1))
                .reverse()
                .map((year) => (
                  <div
                    key={year}
                    onClick={() => {
                      handleYearSelect(year);
                      changeYear(year);
                    }}
                    className="hover:text-primary cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                  >
                    {year}년
                  </div>
                ))}
            </div>
          )}
        </div>
        {/* 월 드롭다운 */}
        <div className="relative">
          <div
            onClick={() => setIsMonthOpen((prev) => !prev)}
            className="flex cursor-pointer items-center justify-center rounded-lg bg-white px-3 py-1 text-[1.1rem] text-gray-800 hover:bg-gray-100"
          >
            <span>{(selectedDate ? new Date(selectedDate) : today).getMonth() + 1}월</span>
          </div>
          {isMonthOpen && (
            <div className="border-input absolute top-full right-0 left-0 z-10 mt-1 max-h-60 min-w-[90px] overflow-auto rounded-lg border bg-white shadow-lg">
              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <div
                  key={month}
                  onClick={() => {
                    handleMonthSelect(month);
                    changeMonth(month);
                  }}
                  className="hover:text-primary cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                >
                  {month + 1}월
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ChevronRightIcon
        size={20}
        onClick={increaseMonth}
        className="hidden flex-1 cursor-pointer text-gray-500 sm:block"
      />
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-x-2">
      <div className="relative w-full">
        <DatePicker
          open={popoverOpen}
          onClickOutside={() => {
            setIsOpen(false);
            setIsMonthOpen(false);
            setPopoverOpen(false);
          }}
          selected={selectedDate}
          onChange={handleSelect}
          onInputClick={() => {
            setIsOpen(false);
            setIsMonthOpen(false);
            setPopoverOpen(!popoverOpen);
          }}
          dateFormat={getDateFormat()}
          locale={ko}
          placeholderText={getPlaceholder()}
          className={cn('border-input h-9 w-full cursor-pointer rounded-sm border-1 pl-3 shadow-xs', className)}
          calendarClassName={cn('custom-calendar', mode === 'month' && 'month-picker-calendar')}
          popperClassName="custom-popper"
          shouldCloseOnSelect={mode === 'month'} // 월 모드일 때는 선택 시 닫기
          showMonthYearPicker={mode === 'month'} // 월 모드일 때 월/연도 선택기 활성화
          renderCustomHeader={mode === 'month' ? renderMonthCustomHeader : renderDateCustomHeader}
        />
        <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform cursor-pointer opacity-50" />
      </div>
      {isResetable && (
        <RotateCcw
          onClick={() => {
            setSelectedDate(null);
            onSelect?.(null);
          }}
          className="my-auto size-5 cursor-pointer text-gray-400"
        />
      )}
    </div>
  );
};
