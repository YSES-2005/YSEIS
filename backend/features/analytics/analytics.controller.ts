import { Request, Response, NextFunction } from 'express';
import TransactionModel from '../transactions/transaction.model';

type GroupBy = 'day' | 'week' | 'month';

const getDateGroupingExpression = (
  groupBy: GroupBy,
  dateField: string, // e.g., '$created_at' or '$returnedAt'
  timezone: string
) => {
  if (groupBy === 'week') {
    // 1. Truncate date to the start of the week (Monday)
    // 2. Format that resulting date as YYYY-MM-DD
    return {
      $dateToString: {
        format: '%Y-%m-%d',
        date: {
          $dateTrunc: {
            date: dateField,
            unit: 'week',
            timezone: timezone,
            startOfWeek: 'monday', // Or 'sunday', depending on your preference
          },
        },
        timezone: timezone,
      },
    };
  }

  // Default behavior for day and month
  const format = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
  return {
    $dateToString: {
      format: format,
      date: dateField,
      timezone: timezone,
    },
  };
};

const buildDateQuery = (startDate?: string, endDate?: string) => {
  const query: Record<string, Date> = {};
  if (startDate) {
    query.$gte = new Date(startDate);
  }
  if (endDate) {
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
    query.$lte = d;
  }
  return Object.keys(query).length > 0 ? query : undefined;
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

    // Removed simple getDateFormat; using logic inside the aggregation construction instead.
    const dateQuery = buildDateQuery(startDate, endDate);
    const timezone = '+08:00';

    const borrowedMatch: Record<string, any> = {
      approvalStatus: { $in: ['approved', 'released'] },
    };
    if (dateQuery) borrowedMatch.created_at = dateQuery;

    const returnedMatch: Record<string, any> = {
      returned: true,
    };
    if (dateQuery) returnedMatch.returnedAt = dateQuery;

    const [borrowedData, returnedData] = await Promise.all([
      TransactionModel.aggregate([
        { $match: borrowedMatch },
        {
          $group: {
            // Use the helper to determine grouping logic
            _id: getDateGroupingExpression(groupBy, '$created_at', timezone),
            count: { $sum: '$quantity' },
            transactions: { $sum: 1 },
          },
        },
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
        { $match: returnedMatch },
        {
          $group: {
            // Use the helper here as well for returnedAt
            _id: getDateGroupingExpression(groupBy, '$returnedAt', timezone),
            count: { $sum: '$quantity' },
            transactions: { $sum: 1 },
          },
        },
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

    // Merging Logic (Remains unchanged)
    const merged = new Map<string, any>();

    const getOrInit = (date: string) => {
      if (!merged.has(date)) {
        merged.set(date, {
          date,
          borrowed: 0,
          borrowedTransactions: 0,
          returned: 0,
          returnedTransactions: 0,
        });
      }
      return merged.get(date);
    };

    borrowedData.forEach(item => {
      const entry = getOrInit(item.date);
      entry.borrowed = item.borrowed;
      entry.borrowedTransactions = item.borrowedTransactions;
    });

    returnedData.forEach(item => {
      const entry = getOrInit(item.date);
      entry.returned = item.returned;
      entry.returnedTransactions = item.returnedTransactions;
    });

    const result = Array.from(merged.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.json({ data: result, groupBy });
  } catch (error) {
    next(error);
  }
};

export default { getBorrowingTrends };
