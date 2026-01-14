import { Request, Response, NextFunction } from 'express';
import TransactionModel from '../transactions/transaction.model';

type GroupBy = 'day' | 'week' | 'month';

const getDateFormat = (groupBy: GroupBy): string => {
  switch (groupBy) {
    case 'day':
      return '%Y-%m-%d';
    case 'week':
      return '%Y-W%V';
    case 'month':
      return '%Y-%m';
  }
};

const getStartDateFilter = (
  startDate?: string
): Record<string, Date> | undefined => {
  if (!startDate) return undefined;
  return { $gte: new Date(startDate) };
};

const getEndDateFilter = (
  endDate?: string
): Record<string, Date> | undefined => {
  if (!endDate) return undefined;
  const d = new Date(endDate);
  d.setHours(23, 59, 59, 999);
  return { $lte: d };
};

export const getBorrowingTrends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      startDate,
      endDate,
      groupBy = 'day',
    } = req.query as {
      startDate?: string;
      endDate?: string;
      groupBy?: GroupBy;
    };

    const dateFormat = getDateFormat(groupBy);
    const dateFilter: Record<string, any> = {};

    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      dateFilter.$lte = d;
    }

    const [borrowedData, returnedData] = await Promise.all([
      TransactionModel.aggregate([
        {
          $match: {
            created_at: Object.keys(dateFilter).length ? dateFilter : undefined,
            approvalStatus: { $in: ['approved', 'released'] },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: '$created_at' },
            },
            count: { $sum: '$quantity' },
            transactions: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            borrowed: '$count',
            borrowedTransactions: '$transactions',
          },
        },
      ]),
      TransactionModel.aggregate([
        {
          $match: {
            returnedAt: Object.keys(dateFilter).length ? dateFilter : undefined,
            returned: true,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: '$returnedAt' },
            },
            count: { $sum: '$quantity' },
            transactions: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            returned: '$count',
            returnedTransactions: '$transactions',
          },
        },
      ]),
    ]);

    const merged = new Map<string, any>();
    for (const item of borrowedData) {
      merged.set(item.date, {
        date: item.date,
        borrowed: item.borrowed,
        borrowedTransactions: item.borrowedTransactions,
        returned: 0,
        returnedTransactions: 0,
      });
    }
    for (const item of returnedData) {
      const existing = merged.get(item.date);
      if (existing) {
        existing.returned = item.returned;
        existing.returnedTransactions = item.returnedTransactions;
      } else {
        merged.set(item.date, {
          date: item.date,
          borrowed: 0,
          borrowedTransactions: 0,
          returned: item.returned,
          returnedTransactions: item.returnedTransactions,
        });
      }
    }

    const result = Array.from(merged.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.json({ data: result, groupBy });
  } catch (error) {
    next(error);
  }
};

export default { getBorrowingTrends };
