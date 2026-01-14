import { Request, Response, NextFunction } from 'express';
import ItemModel from './item.model';
import TransactionModel from '../transactions/transaction.model';
import { UserModel } from '../users/user.model';
import { NotFoundError } from '../../errors';

// GET api/items
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      status,
      type,
      quantity,
      custodian,
      startDate,
      endDate,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string | undefined>;

    const query: Record<string, any> = { status: { $ne: 'deleted' } };

    if (status && status !== 'all') {
      if (status === 'available') {
        query.status = 'available';
        query.quantity = { $gt: 0 };
      } else if (status === 'unavailable') {
        query.$and = [
          { status: { $ne: 'deleted' } },
          { $or: [{ status: 'unavailable' }, { quantity: 0 }] },
        ];
      } else {
        query.status = status;
      }
    }

    if (type) query.type = type;

    if (quantity?.length) {
      const isMaxLimit = quantity.startsWith('-');
      const val = Math.abs(parseInt(quantity));

      if (!isNaN(val)) {
        query.quantity = query.quantity || {};

        if (isMaxLimit) {
          query.quantity.$lte = val;
        } else {
          query.quantity.$gte = val;
        }
      }
    }

    if (search) query.name = { $regex: new RegExp(search, 'i') };

    if (startDate || endDate) {
      const range: Record<string, Date> = {};
      if (startDate) range.$gte = new Date(startDate);
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        range.$lte = d;
      }
      query.updated_at = range;
    }

    if (custodian) {
      const matchingUsers = await UserModel.find({
        $or: [
          { name: { $regex: new RegExp(custodian, 'i') } },
          { email: { $regex: new RegExp(custodian, 'i') } },
        ],
      }).select('_id');

      const userIds = matchingUsers.map(u => u._id);
      query.custodian = { $in: userIds };
    }

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const [items, totalCount] = await Promise.all([
      ItemModel.find(query)
        .populate('custodian', 'name email avatar')
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(limitNumber),
      ItemModel.countDocuments(query),
    ]);

    res.json({
      data: items,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get item by item id
//GET api/items/id
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const item = await ItemModel.findById(id).populate(
      'custodian',
      'name email'
    );

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

//create new item
//POST appi/items
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const custodian = payload.custodian || req.userId;

    const newItem = new ItemModel({
      ...payload,
      custodian,
      status: payload.status ?? 'available',
    });

    await newItem.save();
    res.status(201).json({ newItem });
  } catch (error) {
    next(error);
  }
};

//update existing item
//PUT api/items/id
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // sets status based on quantity
    if (payload.quantity !== undefined) {
      if (payload.quantity === 0) {
        payload.status = 'unavailable';
      } else if (payload.quantity > 0 && payload.status === 'unavailable') {
        payload.status = 'available';
      }
    }

    const item = await ItemModel.findByIdAndUpdate(id, payload, { new: true });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

//deletes item (just changes status)
//DELETE api/items/id
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const item = await ItemModel.findByIdAndUpdate(
      id,
      { status: 'deleted' },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// GET api/items/analytics/inventory-stats
export const getInventoryStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalItemsResult, releasedTransactions] = await Promise.all([
      ItemModel.aggregate([
        { $match: { status: { $ne: 'deleted' } } },
        { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
      ]),
      TransactionModel.find({ approvalStatus: 'released' }),
    ]);

    const totalInventory = totalItemsResult[0]?.totalQuantity || 0;
    const totalInField = releasedTransactions.reduce(
      (sum, t) => sum + (t.quantity || 0),
      0
    );
    const totalInShelf = totalInventory - totalInField;

    res.json({
      inField: totalInField,
      inShelf: totalInShelf,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getInventoryStats,
};
