import { describe, it, expect } from 'vitest';
import {
  itemSchema,
  updateItemSchema,
  borrowFormSchema,
  multiBorrowFormSchema,
} from '../schemas/itemSchema';
import { loginSchema } from '../schemas/loginSchema';
import {
  userSchema,
  userRegisterSchema,
  userListSchema,
} from '../schemas/userSchema';
import {
  returnCreateSchema,
  returnUpdateSchema,
} from '../schemas/returnSchema';
import {
  notificationSchema,
  createNotificationSchema,
} from '../schemas/notificationSchema';
import {
  transactionSchema,
  transactionUpdateSchema,
} from '../schemas/transactionSchema';

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

  describe('userSchema & userRegisterSchema', () => {
    it('validates valid user data', () => {
      const valid = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        avatar: 'https://example.com/avatar.png',
        urgent_borrow_uses: 2,
        preferences: {
          emailAlerts: true,
          dueDateReminders: false,
        },
      };
      const result = userSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid user registration payload with short password', () => {
      const invalid = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123',
      };
      const result = userRegisterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('validates userRegisterSchema without role or urgent_borrow_uses', () => {
      const validRegister = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securepassword',
      };
      const result = userRegisterSchema.safeParse(validRegister);
      expect(result.success).toBe(true);
    });

    it('validates userListSchema with valid ObjectId', () => {
      const validListItem = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
      };
      const result = userListSchema.safeParse(validListItem);
      expect(result.success).toBe(true);
    });

    it('rejects userListSchema with invalid ObjectId', () => {
      const invalidListItem = {
        _id: 'invalid-id',
        name: 'John Doe',
      };
      const result = userListSchema.safeParse(invalidListItem);
      expect(result.success).toBe(false);
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

  describe('returnSchema', () => {
    it('validates returnCreateSchema', () => {
      const valid = {
        transaction: '507f1f77bcf86cd799439011',
        description: 'Item returned in working condition',
        condition: ['clean', 'functioning'],
        status: 'pending',
      };
      const result = returnCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects returnCreateSchema missing description', () => {
      const invalid = {
        transaction: '507f1f77bcf86cd799439011',
      };
      const result = returnCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('validates returnUpdateSchema', () => {
      const valid = {
        status: 'completed',
        description: 'Verified by custodian',
      };
      const result = returnUpdateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('notificationSchema', () => {
    it('validates valid notification object', () => {
      const valid = {
        id: 'notif-123',
        recipient: '507f1f77bcf86cd799439011',
        type: 'INFO',
        title: 'Item Approved',
        message: 'Your borrow request has been approved.',
        isRead: false,
        created_at: new Date(),
      };
      const result = notificationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates createNotificationSchema omitting generated fields', () => {
      const validCreate = {
        recipient: '507f1f77bcf86cd799439011',
        type: 'SUCCESS',
        title: 'Borrow Approved',
        message: 'Item ready for pickup',
      };
      const result = createNotificationSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
    });
  });

  describe('transactionSchema', () => {
    it('validates a valid transaction object with Date instance', () => {
      const valid = {
        item: '507f1f77bcf86cd799439011',
        borrower: '507f1f77bcf86cd799439012',
        quantity: 2,
        purpose: 'Lab experiment',
        returnDate: new Date(Date.now() + 86400000),
      };
      const result = transactionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('preprocesses string and number return dates', () => {
      const withString = {
        item: '507f1f77bcf86cd799439011',
        borrower: '507f1f77bcf86cd799439012',
        quantity: 1,
        purpose: 'String date testing',
        returnDate: '2027-01-01T00:00:00.000Z',
      };
      expect(transactionSchema.safeParse(withString).success).toBe(true);

      const withNumber = {
        item: '507f1f77bcf86cd799439011',
        borrower: '507f1f77bcf86cd799439012',
        quantity: 1,
        purpose: 'Timestamp testing',
        returnDate: Date.now() + 86400000,
      };
      expect(transactionSchema.safeParse(withNumber).success).toBe(true);

      const withInvalid = {
        item: '507f1f77bcf86cd799439011',
        borrower: '507f1f77bcf86cd799439012',
        quantity: 1,
        purpose: 'Invalid date testing',
        returnDate: 'not-a-date',
      };
      expect(transactionSchema.safeParse(withInvalid).success).toBe(false);

      const withNull = {
        item: '507f1f77bcf86cd799439011',
        borrower: '507f1f77bcf86cd799439012',
        quantity: 1,
        purpose: 'Null date testing',
        returnDate: null,
      };
      expect(transactionSchema.safeParse(withNull).success).toBe(false);
    });

    it('validates transactionUpdateSchema with at least one field', () => {
      const valid = {
        approvalStatus: 'approved',
      };
      const result = transactionUpdateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects transactionUpdateSchema with empty object', () => {
      const empty = {};
      const result = transactionUpdateSchema.safeParse(empty);
      expect(result.success).toBe(false);
    });
  });
});
