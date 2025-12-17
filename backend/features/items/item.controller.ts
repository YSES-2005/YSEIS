import { Request, Response, NextFunction } from 'express';
import ItemModel from './item.model';
import { NotFoundError } from '../../errors';

//gets all items
//GET api/items  
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await ItemModel.find().populate('custodian', 'name email');
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
};

//get item by item id
//GET api/items/id 
export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await ItemModel.findById(id).populate('custodian', 'name email');
    
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json({ data: item });
  } catch (error) {
    next(error);
  }
};

//create new item
//POST appi/items
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const custodian = payload.custodian || req.userId;

    const newItem = new ItemModel({
      ...payload,
      custodian,
      status: payload.status ?? 'available'
    });

    await newItem.save();
    res.status(201).json({ data: newItem });
  } catch (error) {
    next(error);
  }
};

//update existing item
//PUT api/items/id
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;

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
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const item = await ItemModel.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json({ data: item });
  } catch (error) {
    next(error);
  }
};

export default { getItems, getItemById, createItem, updateItem, deleteItem };
