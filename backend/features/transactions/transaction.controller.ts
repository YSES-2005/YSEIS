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

// GET /api/transactions
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      search,
      startDate,
      endDate,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string | undefined>;

    const filter: Record<string, any> = {};

    // filter by status
    if (status && status !== 'all') {
      filter.approvalStatus = status;
    }

    // Date Range Filter (based on created_at or createdAt)
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        dateFilter.$lte = d;
      }
      filter.created_at = dateFilter;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      const [users, items] = await Promise.all([
        UserModel.find({ name: regex }).select('_id'),
        ItemModel.find({ name: regex }).select('_id'),
      ]);

      filter.$or = [
        { borrower: { $in: users.map(u => u._id) } },
        { item: { $in: items.map(i => i._id) } },
      ];
    }

    // pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      TransactionModel.find(filter)
        .populate('item', 'avatar name type avatar quantity status')
        .populate('borrower', 'name email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum),
      TransactionModel.countDocuments(filter),
    ]);

    res.json({
      transactions,
      pagination: {
        totalItems: total,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/me
export const getTransactionsForMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.userId;
    // optional: add status filter for user's own view too?
    const { status } = req.query;
    const filter: any = { borrower: uid };
    if (status) filter.approvalStatus = status;

    const transactions = await TransactionModel.find(filter)
      .populate('item', 'name type avatar')
      .populate('borrower', 'name email')
      .sort({ created_at: -1 });

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

// POST /api/transactions
export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { item, purpose, urgency, returnDate, quantity } = req.body;
    const borrower = req.userId;

    const requestedQty = quantity ? parseInt(quantity) : 1;
    if (requestedQty < 1)
      throw new BadRequestError('Quantity must be at least 1');

    const itemDoc = await ItemModel.findById(item);
    if (!itemDoc) {
      throw new NotFoundError('Item not found');
    }

    if (
      itemDoc.status === 'unavailable' ||
      itemDoc.status === 'deleted' ||
      itemDoc.quantity < requestedQty
    ) {
      throw new BadRequestError(
        `Cannot create transaction: Item is unavailable or insufficient stock (Requested: ${requestedQty}, Available: ${itemDoc.quantity}).`
      );
    }

    const transaction = new TransactionModel({
      item,
      borrower,
      purpose,
      urgency,
      returnDate,
      quantity: requestedQty,
      approvalStatus: 'pending',
    });

    await transaction.save();

    const admins = await UserModel.find({ role: 'admin' });
    if (admins.length > 0) {
      await transaction.populate(['item', 'borrower']);
      const populatedBorrower =
        transaction.borrower as unknown as PopulatedUser;
      const populatedItem = transaction.item as unknown as PopulatedItem;

      await Promise.all(
        admins.map(admin =>
          notify(
            (admin._id as Types.ObjectId).toString(),
            'New Borrow Request',
            `${populatedBorrower.name} requested ${requestedQty}x ${populatedItem.name}.`,
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

// PUT /api/transactions/:id
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

    const transactionQty = (transaction as any).quantity || 1;

    if (payload.approvalStatus) {
      if (role !== 'admin' && payload.approvalStatus !== 'released') {
        throw new ForbiddenError('Admin required to change status');
      }

      if (
        payload.approvalStatus === 'approved' &&
        transaction.approvalStatus !== 'approved'
      ) {
        const updatedItem = await ItemModel.findOneAndUpdate(
          {
            _id: transaction.item,
            quantity: { $gte: transactionQty }, // condition: enough stock
            status: { $ne: 'unavailable' },
          },
          { $inc: { quantity: -transactionQty } }, // atomic decrement
          { new: true }
        );

        if (!updatedItem) {
          throw new BadRequestError(
            `Cannot approve: Insufficient stock for "${populatedItem.name}".`
          );
        }

        if (updatedItem.quantity === 0) {
          updatedItem.status = 'unavailable';
          await updatedItem.save();
        }
      }

      transaction.approvalStatus = payload.approvalStatus;

      if (['approved', 'disapproved'].includes(payload.approvalStatus)) {
        const isApproved = payload.approvalStatus === 'approved';
        await notify(
          populatedBorrower._id.toString(),
          isApproved ? 'Request Approved' : 'Request Declined',
          `Your request for ${transactionQty}x "${populatedItem.name}" has been ${payload.approvalStatus}.`,
          isApproved ? 'SUCCESS' : 'ERROR',
          { shouldEmail: true }
        );
      }
    }

    if (payload.returned === true) {
      if (populatedBorrower._id.toString() !== uid && role !== 'admin') {
        throw new ForbiddenError('Not allowed to return this item');
      }

      if (!transaction.returned) {
        const updatedItem = await ItemModel.findByIdAndUpdate(
          transaction.item,
          { $inc: { quantity: transactionQty } }, // atomic increment
          { new: true }
        );

        // If item was previously unavailable (0 stock), make it available again
        if (updatedItem && updatedItem.status === 'unavailable') {
          updatedItem.status = 'available';
          await updatedItem.save();
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
                `${populatedBorrower.name} returned ${transactionQty}x "${populatedItem.name}".`,
                'INFO',
                { shouldEmail: false }
              )
            )
          );
        }
      }
    }

    if (payload.returned === false && role === 'admin') {
      transaction.returned = false;
      transaction.returnedAt = undefined;
    }

    // Update other fields if provided
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
