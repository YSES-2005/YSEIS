import { describe, it, expect } from 'vitest';
import {
  cn,
  getCustodianDisplay,
  getPageNumbers,
  pluralize,
} from '../lib/utils';

describe('Frontend Utility Functions (src/lib/utils.ts)', () => {
  describe('cn (Class name merger)', () => {
    it('merges class names correctly', () => {
      const result = cn('p-4', 'bg-red-500', {
        'text-white': true,
        hidden: false,
      });
      expect(result).toBe('p-4 bg-red-500 text-white');
    });

    it('resolves conflicting Tailwind utility classes', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });
  });

  describe('getCustodianDisplay', () => {
    it('returns fallback dash for null/undefined', () => {
      expect(getCustodianDisplay(undefined)).toBe('—');
      expect(getCustodianDisplay(null as any)).toBe('—');
    });

    it('returns string custodian as-is', () => {
      expect(getCustodianDisplay('John Doe')).toBe('John Doe');
    });

    it('returns custodian name when available', () => {
      expect(
        getCustodianDisplay({
          name: 'Alice Smith',
          email: 'alice@example.com',
        } as any)
      ).toBe('Alice Smith');
    });

    it('returns custodian email when name is missing', () => {
      expect(getCustodianDisplay({ email: 'bob@example.com' } as any)).toBe(
        'bob@example.com'
      );
    });

    it('returns fallback dash when object lacks name and email', () => {
      expect(getCustodianDisplay({} as any)).toBe('—');
    });
  });

  describe('getPageNumbers', () => {
    it('returns full sequence when totalPages <= maxVisible', () => {
      expect(getPageNumbers(1, 3, 5)).toEqual([1, 2, 3]);
    });

    it('centers current page within window', () => {
      expect(getPageNumbers(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    });

    it('handles start edge cases correctly', () => {
      expect(getPageNumbers(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(getPageNumbers(2, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles end edge cases correctly', () => {
      expect(getPageNumbers(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
      expect(getPageNumbers(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe('pluralize', () => {
    it('pluralizes word when quantity is 2 or more', () => {
      expect(pluralize('item', 2)).toBe('items');
      expect(pluralize('item', 5)).toBe('items');
    });

    it('returns singular form when quantity is less than 2', () => {
      expect(pluralize('item', 1)).toBe('item');
      expect(pluralize('item', 0)).toBe('item');
    });
  });
});
