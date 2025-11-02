import { Request, Response } from 'express';

export const getItems = async (req: Request, res: Response) => {
	res.json({ data: [] });
};

export const getItemById = async (req: Request, res: Response) => {
	const { id } = req.params;
	res.json({ id, data: null });
};

export const createItem = async (req: Request, res: Response) => {
	const payload = req.body;
	res.status(201).json({ data: payload });
};

export const updateItem = async (req: Request, res: Response) => {
	const { id } = req.params;
	const payload = req.body;
	res.json({ id, data: payload });
};

export const deleteItem = async (req: Request, res: Response) => {
	const { id } = req.params;
	res.status(204).send();
};

export default { getItems, getItemById, createItem, updateItem, deleteItem };
