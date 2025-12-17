import { Request, Response, NextFunction } from 'express';
import TransactionModel from './transaction.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../errors';

// GET /api/transactions?status=pending this is for admin
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const filter = status ? { approvalStatus: status } : {};
    
    const transactions = await TransactionModel.find(filter)
      .populate('item')
      .populate('borrower', '-password');
      
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/me (authenticated user)
export const getTransactionsForMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.userId;
    const transactions = await TransactionModel.find({ borrower: uid })
      .populate('item')
      .populate('borrower', '-password');
      
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/:id
export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
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

// POST /api/transactions this is for creating borrow request
export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item, purpose, urgency, returnDate } = req.body;
    const borrower = (req.userId as string) ?? req.body.borrower;

    console.debug('[createTransaction] borrower:', borrower, 'typeof:', typeof borrower);

    const transaction = new TransactionModel({
      item,
      borrower,
      purpose,
      urgency,
      returnDate,
      approvalStatus: 'pending'
    });

    await transaction.save();
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

// PUT /api/transactions/:id, admin can update status of the item 
export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const role = req.userRole;
    const uid = req.userId;

    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (payload.approvalStatus) {
      if (role !== 'admin') {
        throw new ForbiddenError('Admin required to change status');
      }
      transaction.approvalStatus = payload.approvalStatus;
    }

    if (payload.returned === true) {
      if (transaction.borrower.toString() !== uid && role !== 'admin') {
        throw new ForbiddenError('Not allowed to return this item');
      }
      transaction.returned = true;
      transaction.returnedAt = new Date();
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

export default { getTransactions, getTransactionsForMe, getTransactionById, createTransaction, updateTransaction };
