import cron from 'node-cron';
import { notify } from './notification.service';

import ItemModel from '../items/item.model';
import TransactionModel from '../transactions/transaction.model';
import { LOW_STOCK_THRESHOLD } from '@schemas/itemSchema';

export const startNotificationScheduler = () => {
  console.log('Notification Scheduler Initialized');

  // stock checker every 4 hours
  cron.schedule('0 */4 * * *', async () => {
    console.log('Running Low Stock Check...');

    try {
      // find items with low stock that are not deleted
      const lowStockItems = await ItemModel.find({
        quantity: { $lte: LOW_STOCK_THRESHOLD },
        status: { $ne: 'deleted' },
      }).populate('custodian');

      for (const item of lowStockItems) {
        const custodian = item.custodian as any;

        if (custodian && custodian._id) {
          await notify(
            custodian._id.toString(),
            'Low Stock Alert',
            `Your item "${item.name}" is running low on stock (${item.quantity} remaining).`,
            'WARNING',
            {
              shouldEmail: true,
              relatedEntityId: item._id.toString(),
              relatedModel: 'Item',
            }
          );
        }
      }
    } catch (error) {
      console.error('Error in Low Stock Cron:', error);
    }
  });
  // overdue checker every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running Overdue Check...');
    const today = new Date();

    try {
      const overdueTransactions = await TransactionModel.find({
        approvalStatus: 'approved',
        returned: false,
        returnDate: { $lt: today },
      })
        .populate('borrower')
        .populate('item');

      for (const txn of overdueTransactions) {
        const borrower = txn.borrower as any;
        const item = txn.item as any;

        if (borrower && borrower._id && item) {
          await notify(
            borrower._id.toString(),
            'Overdue Item Return',
            `You are late returning "${item.name}". Please return it immediately.`,
            'ERROR',
            {
              shouldEmail: true,
              relatedEntityId: txn._id.toString(),
              relatedModel: 'Transaction',
            }
          );
        }
      }
    } catch (error) {
      console.error('Error in Overdue Cron:', error);
    }
  });

  // Due date reminder every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running Due Date Reminder Check...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    try {
      const dueTransactions = await TransactionModel.find({
        approvalStatus: { $in: ['approved', 'released'] },
        returned: false,
        returnDate: { $gte: startOfTomorrow, $lte: endOfTomorrow },
      })
        .populate('borrower')
        .populate('item');

      for (const txn of dueTransactions) {
        const borrower = txn.borrower as any;
        const item = txn.item as any;

        if (borrower && borrower._id && item) {
          await notify(
            borrower._id.toString(),
            'Due Date Reminder',
            `Reminder: Your item "${item.name}" is due for return tomorrow.`,
            'INFO',
            {
              shouldEmail: true,
              relatedEntityId: txn._id.toString(),
              relatedModel: 'Transaction',
            }
          );
        }
      }
    } catch (error) {
      console.error('Error in Due Date Reminder Cron:', error);
    }
  });
};
