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
      type,
      borrower,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string | undefined>;

    const filter: Record<string, any> = {};

    // filter by status
    if (status && status !== 'all') {
      if (status === 'returned') {
        filter.returned = true;
      } else {
        filter.approvalStatus = status;
      }
    }
    
    // filter by item type
    if (type && type !== 'any') {
        const regex = new RegExp(`^${type}$`, 'i');
        const items = await ItemModel.find({ type: regex }).select('_id');
        filter.item = { $in: items.map(i => i._id) };
    }

    // filter by borrower name
    if (borrower) {
        const regex = new RegExp(borrower, 'i');
        const users = await UserModel.find({ name: regex }).select('_id');
        filter.borrower = { $in: users.map(u => u._id) };
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
    const {
      status,
      search,
      startDate,
      endDate,
      type,
    } = req.query as Record<string, string | undefined>;

    const filter: Record<string, any> = { borrower: uid };

    // filter by status
    if (status && status !== 'all') {
      if (status === 'returned') {
        filter.returned = true;
      } else {
        filter.approvalStatus = status;
      }
    }

    // filter by item type
    if (type && type !== 'any') {
        const regex = new RegExp(`^${type}$`, 'i');
        const items = await ItemModel.find({ type: regex }).select('_id');
        filter.item = { $in: items.map(i => i._id) };
    }

    // Date Range Filter
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
      const items = await ItemModel.find({ name: regex }).select('_id');
      
      // Since borrower is fixed to me, search only makes sense for item name
      // We merge this with existing filter.item if type filter exists
      
      const itemIdsFromSearch = items.map(i => i._id);
      
      if (filter.item) {
        // Intersection of existing item filter (from type) and search results
        // This is a bit complex in mongo. Easier to use $and or check if ID is in list.
        // But since filter.item is likely { $in: [...] }, we can modify it.
        const typeIds = (filter.item as any).$in as Types.ObjectId[];
        // intersection strings
         const intersection = typeIds.filter(tid => 
            itemIdsFromSearch.some(sid => sid.toString() === tid.toString())
         );
         filter.item = { $in: intersection };
      } else {
         filter.item = { $in: itemIdsFromSearch };
      }
    }

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
      const isOwner = uid === (transaction.borrower as any)._id.toString();
      const isSelfCancel = isOwner && payload.approvalStatus === 'cancelled' && transaction.approvalStatus === 'pending';

      if (role !== 'admin' && !isSelfCancel && payload.approvalStatus !== 'released') {
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
      throw new BadRequestError('Please use the /api/returns endpoint to return items.');
    }

    if (payload.returned === false) {
       throw new BadRequestError('Cannot undo return via transaction update.');
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

// GET /api/transactions/analytics/most-borrowed
export const getMostBorrowedItem = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await TransactionModel.aggregate([
      {
        $group: {
          _id: '$item',
          totalBorrowed: { $sum: '$quantity' },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { totalBorrowed: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: '$item' },
      {
        $project: {
          _id: 0,
          name: '$item.name',
          avatar: '$item.avatar',
          totalBorrowed: 1,
          transactionCount: 1,
        },
      },
    ]);

    res.json(result[0] || null);
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
  getMostBorrowedItem,
};
