import { Request, Response, NextFunction } from 'express';
import ItemModel from './item.model';
import { NotFoundError } from '../../errors';

//gets all items
//GET api/items
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
      custodian,
      startDate,
      endDate,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string | undefined>;

    // add query object
    const query: Record<string, any> = { status: { $ne: 'deleted' } };

    // filter by status
    if (status && status !== 'all') {
      if (status === 'available') {
        query.status = 'available';
        query.quantity = { $gt: 0 };
      } else if (status === 'unavailable') {
        delete query.status;
        query.$and = [
          { status: { $ne: 'deleted' } },
          { $or: [{ status: 'unavailable' }, { quantity: 0 }] },
        ];
      } else {
        query.status = status;
      }
    }

    // filter by type
    if (type) {
      query.type = type;
    }

    // search by name (case-insensitive regex)
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') };
    }

    // Note: custodian filter will be applied after populate
    // since we need to search in populated name/email fields

    // date range filtering
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

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    let itemsQuery = ItemModel.find(query)
      .populate('custodian', 'name email avatar')
      .sort({ updated_at: -1 });

    // Get total count before pagination
    const totalCount = await ItemModel.countDocuments(query);

    // Apply pagination
    let items = await itemsQuery.skip(skip).limit(limitNumber);

    // Apply custodian filter if provided (after populate)
    if (custodian) {
      const custodianLower = custodian.toLowerCase();
      items = items.filter((item: any) => {
        const custodianObj = item.custodian;
        if (!custodianObj) return false;
        const name = custodianObj.name?.toLowerCase() || '';
        const email = custodianObj.email?.toLowerCase() || '';
        return name.includes(custodianLower) || email.includes(custodianLower);
      });
    }

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
    res.status(201).json({ data: newItem });
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

    res.json({ data: item });
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

    res.json({ data: item });
  } catch (error) {
    next(error);
  }
};

export default { getItems, getItemById, createItem, updateItem, deleteItem };