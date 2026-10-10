import { describe, it, expect } from 'vitest';
import {
  itemSchema,
  updateItemSchema,
  borrowFormSchema,
  multiBorrowFormSchema,
} from '../schemas/itemSchema';
import { loginSchema } from '../schemas/loginSchema';

describe('Shared Schemas Validation', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const valid = { email: 'admin@example.com', password: 'password123' };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email and short password', () => {
      const invalid = { email: 'notanemail', password: '123' };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });
  });

  describe('itemSchema', () => {
    it('validates a valid item payload', () => {
      const validItem = {
        avatar: 'https://example.com/item.png',
        name: 'Projector',
        type: 'Electronics',
        quantity: 3,
        location: 'Room 204',
        status: 'available',
      };
      const result = itemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it('rejects invalid avatar and negative quantity', () => {
      const invalidItem = {
        avatar: 'invalid-url',
        name: 'Camera',
        type: 'Electronics',
        quantity: -5,
        location: 'Room 204',
        status: 'available',
      };
      const result = itemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });

  describe('updateItemSchema', () => {
    it('allows partial updates to item fields', () => {
      const partialUpdate = { quantity: 10, status: 'unavailable' };
      const result = updateItemSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('borrowFormSchema', () => {
    it('validates valid borrow form data', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const valid = {
        returnDate: futureDate,
        purpose: 'Study research project for computer engineering',
        urgent: false,
        quantity: 2,
      };

      const result = borrowFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('handles undefined return date', () => {
      const res = borrowFormSchema.safeParse({
        returnDate: undefined,
        purpose: 'Valid purpose string here',
        quantity: 1,
      });
      expect(res.success).toBe(false);
    });

    it('rejects past return date and too-far return date', () => {
      const pastDate = new Date('2020-01-01');
      const pastResult = borrowFormSchema.safeParse({
        returnDate: pastDate,
        purpose: 'Valid purpose string here',
        quantity: 1,
      });
      expect(pastResult.success).toBe(false);

      const futureDate2Years = new Date();
      futureDate2Years.setFullYear(futureDate2Years.getFullYear() + 2);
      const futureResult = borrowFormSchema.safeParse({
        returnDate: futureDate2Years,
        purpose: 'Valid purpose string here',
        quantity: 1,
      });
      expect(futureResult.success).toBe(false);
    });
  });

  describe('multiBorrowFormSchema', () => {
    it('validates when requested quantity is within available limit', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const payload = {
        returnDate: futureDate,
        purpose: 'Circuit workshop testing',
        items: [
          {
            item: {
              avatar: 'https://example.com/item.png',
              name: 'Resistor Box',
              type: 'Components',
              quantity: 10,
              location: 'Drawer 1',
              status: 'available',
              custodian: 'Staff',
            },
            quantity: 5,
          },
        ],
      };

      const result = multiBorrowFormSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects when requested quantity exceeds available quantity', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const payload = {
        returnDate: futureDate,
        purpose: 'Circuit workshop testing',
        items: [
          {
            item: {
              avatar: 'https://example.com/item.png',
              name: 'Oscilloscope',
              type: 'Equipment',
              quantity: 2,
              location: 'Lab 2',
              status: 'available',
              custodian: { name: 'Lab Tech', email: 'tech@example.com' },
            },
            quantity: 5,
          },
        ],
      };

      const result = multiBorrowFormSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
