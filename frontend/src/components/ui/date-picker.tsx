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

type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date) => void;
} & React.ComponentProps<typeof DayPicker> &
  Omit<React.ComponentProps<typeof Button>, 'disabled' | 'onChange'>;

export function DatePicker({ value, onChange, ...props }: DatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id="returnDate"
            className="justify-between font-normal py-4.25 border border-input"
            aria-invalid={props['aria-invalid']}
          />
        }
      >
        {value ? value.toLocaleDateString() : 'Select date'}
        <CalendarIcon />
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
