import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import TransactionModel from './transaction.model';
import ItemModel from '../items/item.model';
import { UserModel } from '../users/user.model';
import { notify } from '../notifications/notification.service';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../errors';

interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface PopulatedItem {
  _id: Types.ObjectId;
  name: string;
}

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// GET /api/transactions?status=pending (for admin)
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = req.query.status as string | undefined;
    const filter = status ? { approvalStatus: status } : {};

    const transactions = await TransactionModel.find(filter)
      .populate('item', 'name')
      .populate('borrower', 'name email');

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/me (for authenticated user)
export const getTransactionsForMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.userId;
    const transactions = await TransactionModel.find({ borrower: uid })
      .populate('item', 'name')
      .populate('borrower', 'name email');

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/:id
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionModel.findById(id)
      .populate('item')
      .populate('borrower', '-password');

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

// POST /api/transactions (user creates a borrow request)
export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { item, purpose, urgency, returnDate } = req.body;
    const borrower = req.userId;

    const transaction = new TransactionModel({
      item,
      borrower,
      purpose,
      urgency,
      returnDate,
      approvalStatus: 'pending',
    });

    await transaction.save();
    const itemStatus = await ItemModel.findById(item);
    if (itemStatus && itemStatus.status === 'unavailable') {
      throw new BadRequestError(
        'Cannot create transaction: Item is unavailable.'
      );
    }
    const admins = await UserModel.find({ role: 'admin' });
    if (admins.length > 0) {
      await transaction.populate(['item', 'borrower']);

      const populatedBorrower =
        transaction.borrower as unknown as PopulatedUser;
      const populatedItem = transaction.item as unknown as PopulatedItem;

      const borrowerName = populatedBorrower.name;
      const itemName = populatedItem.name;

      // send an email to all admins
      await Promise.all(
        admins.map(admin =>
          notify(
            (admin._id as Types.ObjectId).toString(),
            'New Borrow Request',
            `${borrowerName} has requested to borrow ${itemName}.`,
            'INFO',
            {
              shouldEmail: true,
              relatedEntityId: (transaction._id as Types.ObjectId).toString(),
              relatedModel: 'Transaction',
            }
          )
        )
      );
    }

    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

// PUT /api/transactions/:id (Update status / Return item)
export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const role = req.userRole;
    const uid = req.userId;

    const transaction = await TransactionModel.findById(id).populate([
      'item',
      'borrower',
    ]);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    const populatedBorrower = transaction.borrower as unknown as PopulatedUser;
    const populatedItem = transaction.item as unknown as PopulatedItem;

    const itemName = populatedItem.name;
    const borrowerName = populatedBorrower.name;

    if (payload.approvalStatus) {
      if (role !== 'admin' && payload.approvalStatus !== 'released') {
        throw new ForbiddenError('Admin required to change status');
      }

      if (
        payload.approvalStatus === 'approved' &&
        transaction.approvalStatus !== 'approved'
      ) {
        const itemToUpdate = await ItemModel.findById(transaction.item);
        if (!itemToUpdate)
          throw new NotFoundError('Item record not found in inventory');

        if (
          itemToUpdate.quantity < 1 ||
          itemToUpdate.status === 'unavailable'
        ) {
          throw new BadRequestError(
            `Cannot approve: "${itemToUpdate.name}" is out of unavailable.`
          );
        }

        itemToUpdate.quantity -= 1;
        await itemToUpdate.save();
      }

      transaction.approvalStatus = payload.approvalStatus;

      if (payload.approvalStatus === 'approved') {
        await notify(
          populatedBorrower._id.toString(),
          'Request Approved',
          `Your borrow request for "${itemName}" has been approved.`,
          'SUCCESS',
          { shouldEmail: true }
        );
      } else if (payload.approvalStatus === 'disapproved') {
        await notify(
          populatedBorrower._id.toString(),
          'Request Declined',
          `Your borrow request for "${itemName}" has been declined.`,
          'ERROR',
          { shouldEmail: true }
        );
      }
    }

    if (payload.returned === true) {
      if (populatedBorrower._id.toString() !== uid && role !== 'admin') {
        throw new ForbiddenError('Not allowed to return this item');
      }

      if (!transaction.returned) {
        // fetch item to increment stock
        const itemToUpdate = await ItemModel.findById(transaction.item);
        if (itemToUpdate) {
          itemToUpdate.quantity += 1;

          if (
            itemToUpdate.quantity > 0 &&
            itemToUpdate.status === 'unavailable'
          ) {
            itemToUpdate.status = 'available';
          }
          await itemToUpdate.save();
        }

        transaction.returned = true;
        transaction.returnedAt = new Date();

        const admins = await UserModel.find({ role: 'admin' });
        if (admins.length > 0) {
          await Promise.all(
            admins.map(admin =>
              notify(
                (admin._id as Types.ObjectId).toString(),
                'Item Returned',
                `${borrowerName} has returned the item: "${itemName}".`,
                'INFO',
                { shouldEmail: false }
              )
            )
          );
        }
      }
    }

    if (payload.purpose) transaction.purpose = payload.purpose;
    if (payload.returnDate) transaction.returnDate = payload.returnDate;
    if (payload.urgency !== undefined) transaction.urgency = payload.urgency;

    await transaction.save();
    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

export default {
  getTransactions,
  getTransactionsForMe,
  getTransactionById,
  createTransaction,
  updateTransaction,
};
