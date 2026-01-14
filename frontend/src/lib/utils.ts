import type { ItemPopulated } from '@schemas/itemSchema';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCustodianDisplay = (
  custodian: ItemPopulated['custodian'] | TransactionPopulated['borrower']
) => {
  if (!custodian) return '—';
  if (typeof custodian === 'string') return custodian;
  return custodian.name || custodian.email || '—';
};
