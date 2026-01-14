import { useEffect, useState } from 'react';

export type TimeUnit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years';
export type TimeCategory = 'near' | 'soon' | 'far' | 'overdue';

export interface TimeDiff {
  value: number;
  unit: TimeUnit;
  isOverdue: boolean;
}

const getTimeAgo = (targetDate: Date): TimeDiff => {
  const targetTime = new Date(targetDate).getTime();
  const now = Date.now();
  const isOverdue = now > targetTime;
  const diffInMs = Math.abs(targetTime - now);

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  let result: { value: number; unit: TimeUnit };

  if (diffInMs < minute) {
    result = { value: Math.floor(diffInMs / 1000), unit: 'seconds' };
  } else if (diffInMs < hour) {
    result = { value: Math.floor(diffInMs / minute), unit: 'minutes' };
  } else if (diffInMs < day) {
    result = { value: Math.floor(diffInMs / hour), unit: 'hours' };
  } else if (diffInMs < month) {
    result = { value: Math.floor(diffInMs / day), unit: 'days' };
  } else if (diffInMs < year) {
    result = { value: Math.floor(diffInMs / month), unit: 'months' };
  } else {
    result = { value: Math.floor(diffInMs / year), unit: 'years' };
  }

  return { ...result, isOverdue };
};

const categorizeUnit = (unit: TimeUnit, isOverdue: boolean): TimeCategory => {
  if (isOverdue) return 'overdue';
  switch (unit) {
    case 'seconds':
    case 'minutes':
      return 'near';
    case 'hours':
    case 'days':
      return 'soon';
    case 'months':
    case 'years':
    default:
      return 'far';
  }
};

interface UseTimeAgoOptions {
  live?: boolean;
}

export function useTimeAgo(
  date: Date | undefined,
  { live = true }: UseTimeAgoOptions = {}
) {
  const [timeDiff, setTimeDiff] = useState<TimeDiff | null>(null);
  const [category, setCategory] = useState<TimeCategory>('far');

  useEffect(() => {
    if (!date) return;

    const updateTime = () => {
      const diff = getTimeAgo(date);
      setTimeDiff(diff);
      setCategory(categorizeUnit(diff.unit, diff.isOverdue));
    };

    updateTime();

    if (!live) return;

    const intervalId = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(intervalId);
  }, [date, live]);

  return { timeDiff, category };
}
