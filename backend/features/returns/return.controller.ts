import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ReturnModel from './return.model';
import TransactionModel from '../transactions/transaction.model';
import ItemModel from '../items/item.model';
import { UserModel } from '../users/user.model';
import { notify } from '../notifications/notification.service';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../errors';

interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface PopulatedItem {
  _id: Types.ObjectId;
  name: string;
}

const handleReturnCompletion = async (returnDoc: any) => {
  const transactionDoc = await TransactionModel.findById(returnDoc.transaction)
    .populate('item')
    .populate('borrower');

  if (!transactionDoc) return;
  if (transactionDoc.returned) return;

  const transactionQty = (transactionDoc as any).quantity || 1;

  // Increment inventory
  const updatedItem = await ItemModel.findByIdAndUpdate(
    transactionDoc.item,
    { $inc: { quantity: transactionQty } },
    { new: true }
  );

  // If item was previously unavailable, make it available
  if (updatedItem && updatedItem.status === 'unavailable') {
    updatedItem.status = 'available';
    await updatedItem.save();
  }

  // Mark transaction as returned
  transactionDoc.returned = true;
  transactionDoc.returnedAt = new Date();
  transactionDoc.approvalStatus = 'completed'; // Sync status
  await transactionDoc.save();

  // Notify Admins
  const populatedBorrower = transactionDoc.borrower as unknown as PopulatedUser;
  const populatedItem = transactionDoc.item as unknown as PopulatedItem;

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
};

// GET /api/returns
export const getReturns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const returns = await ReturnModel.find()
      .populate({
        path: 'transaction',
        populate: ['item', 'borrower'],
      })
      .sort({ created_at: -1 });

    res.json({ returns });
  } catch (error) {
    next(error);
  }
};

// GET /api/returns/:id
export const getReturnById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const returnDoc = await ReturnModel.findById(id).populate({
      path: 'transaction',
      populate: ['item', 'borrower'],
    });

    if (!returnDoc) {
      throw new NotFoundError('Return not found');
    }

    res.json({ return: returnDoc });
  } catch (error) {
    next(error);
  }
};

// POST /api/returns
export const createReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const { transaction, description, condition, status } = req.body;
    const returnStatus = status || 'completed';

    // Verify transaction exists
    const transactionDoc = await TransactionModel.findById(transaction)
      .populate('item')
      .populate('borrower');

    if (!transactionDoc) {
      throw new NotFoundError('Transaction not found');
    }

    const borrowerId =
      (transactionDoc.borrower as any)?._id?.toString() ||
      transactionDoc.borrower?.toString();

    if (userRole !== 'admin' && borrowerId !== userId) {
      throw new ForbiddenError(
        'You can only create return requests for your own transactions.'
      );
    }

    if (transactionDoc.returned) {
      throw new BadRequestError('Transaction already marked as returned.');
    }

    const returnDoc = new ReturnModel({
      transaction,
      description,
      status: returnStatus,
      condition,
    });

    await returnDoc.save();

    if (returnStatus === 'completed') {
      await handleReturnCompletion(returnDoc);
    }

    res.status(201).json({ return: returnDoc });
  } catch (error) {
    next(error);
  }
};

// PUT /api/returns/:id
export const updateReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { description, status, condition } = req.body;

    const returnDoc = await ReturnModel.findById(id);
    if (!returnDoc) {
      throw new NotFoundError('Return not found');
    }

    if (description) returnDoc.description = description;
    if (status) returnDoc.status = status;
    if (condition) returnDoc.condition = condition;

    await returnDoc.save();

    if (status === 'completed') {
      await handleReturnCompletion(returnDoc);
    }

    res.json({ return: returnDoc });
  } catch (error) {
    next(error);
  }
};

export default {
  getReturns,
  getReturnById,
  createReturn,
  updateReturn,
};
