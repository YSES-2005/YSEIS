import { Request, Response } from 'express';
//still for checking

//sample
const ITEMS: Record<string, any> = {
  item_1: {
    id: 'item1',
    name: 'Mouse',
    type: 'ABC',
    quantity: 1,
    location: 'Tambayan',
    custodian: 'user_1',
    status: 'available',
    created_at: new Date().toISOString()
  },
  item_2: {
    id: 'item2',
    name: 'Flashlight',
    type: 'DEF',
    quantity: 2,
    location: 'Tambayan',
    custodian: 'user_2',
    status: 'deleted',
    created_at: new Date().toISOString()
  }
}

// Helper to create a random id 
const nextId = (prefix = 'tx') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

//gets all items
//GET api/items  
export const getItems = async (req: Request, res: Response) => {
  const allItems = Object.values(ITEMS);
  res.json({ data: allItems });
};

//get item by item id
//GET api/items/id 
export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  //find id
  const item = Object.values(ITEMS).find(i => i.id == id);
  
  if(!item) return res.status(404).json({ error: 'Item not found' });

  res.json({ data: item });
};

//create new item
//POST appi/items
export const createItem = async (req: Request, res: Response) => {
  const payload = req.body;

  const id = nextId();
  const newItem = {
    id,
    ...payload,
    status: payload.status ?? 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  ITEMS[id] = newItem;
  res.status(201).json({ data: newItem });
};

//update existing item
//PUT api/items/id
export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  let toUpdate = ITEMS[id];

  //check if item exists or status:deleted
  if(!toUpdate || toUpdate.status === 'deleted'){
    return res.status(404).json({ error: 'Item not found' });
  }

  const updatedItem = {
    ...toUpdate,
    ...payload,
    updated_at: new Date().toISOString()
  };

  ITEMS[id] = updatedItem;
  res.json({ data: updatedItem });
};

//deletes item (just changes status)
//DELETE api/items/id
export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  let toDelete = ITEMS[id];

  //check if item exists or status:deleted
  if(!toDelete || toDelete.status === 'deleted'){
    return res.status(404).json({ error: 'Item not found' });
  }

  //change status:deleted (for now)
  toDelete.status = 'deleted';
  toDelete.updated_at = new Date().toISOString();

  res.status(204).send();
};

export default { getItems, getItemById, createItem, updateItem, deleteItem };
