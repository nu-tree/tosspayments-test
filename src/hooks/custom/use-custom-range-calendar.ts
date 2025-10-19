import { formatISO, parseISO } from 'date-fns';
import { useQueryState } from 'nuqs';
import { DateRange } from 'react-day-picker';

function serializeDateRange(v: DateRange | null) {
  if (!v || !v.from) return '';
  // from만 있으면 from, from+to 있으면 from_to
  return v.to
    ? `${formatISO(v.from, { representation: 'date' })}_${formatISO(v.to, { representation: 'date' })}`
    : formatISO(v.from, { representation: 'date' });
}

function parseDateRange(v: string): DateRange | null {
  if (!v) return null;
  const [fromStr, toStr] = v.split('_');
  const from = fromStr ? parseISO(fromStr) : undefined;
  const to = toStr ? parseISO(toStr) : undefined;
  if (!from) return null;
  return { from, to };
}

export function useCustomRangeCalendar(queryName: string) {
  const [date, setDate] = useQueryState<DateRange | null>(queryName, {
    defaultValue: null,
    parse: parseDateRange,
    serialize: serializeDateRange,
  });

  return {
    date,
    setDate,
  };
}
