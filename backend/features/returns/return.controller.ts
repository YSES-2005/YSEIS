import { Request, Response, NextFunction } from 'express';
import ReturnModel from './return.model';
import TransactionModel from '../transactions/transaction.model';
import { NotFoundError, BadRequestError } from '../../errors';

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
        const { transaction, description, status, condition } = req.body;

        // Verify transaction exists
        const transactionDoc = await TransactionModel.findById(transaction);
        if (!transactionDoc) {
            throw new NotFoundError('Transaction not found');
        }

        const returnDoc = new ReturnModel({
            transaction,
            description,
            status,
            condition,
        });

        await returnDoc.save();

        // Mark transaction as returned if not already
        if (!transactionDoc.returned) {
            transactionDoc.returned = true;
            transactionDoc.returnedAt = new Date();
            await transactionDoc.save();
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
