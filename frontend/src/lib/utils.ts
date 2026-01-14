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

export const getPageNumbers = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
};
