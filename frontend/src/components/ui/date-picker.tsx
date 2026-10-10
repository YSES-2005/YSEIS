import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DayPicker } from 'react-day-picker';
import { formatRelative } from 'date-fns';

type DatePickerProps = {
  value: Date | undefined;
  relative?: boolean;
  onChange: (date: Date) => void;
} & React.ComponentProps<typeof DayPicker> &
  Omit<React.ComponentProps<typeof Button>, 'disabled' | 'onChange' | 'value'>;

export function DatePicker({
  value,
  relative,
  onChange,
  ...props
}: DatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger
        render={props.render}
        className="capitalize cursor-pointer"
      >
        <CalendarIcon />
        {value
          ? relative
            ? formatRelative(value, new Date()).split(' ')[0]
            : value.toLocaleDateString()
          : 'Select date'}
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="label"
          disabled={props.disabled}
          onSelect={date => {
            if (date) {
              onChange(date);
              setCalendarOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
