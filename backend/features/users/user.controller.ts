import { Request, Response } from 'express';

// Placeholder lng den wala pang database e
const USERS: Record<string, any> = {
	user_1: { id: 'user_1', name: 'Alice', role: 'admin' },
	user_2: { id: 'user_2', name: 'Bob', role: 'user' },
};

export const me = (req: Request, res: Response) => {

	const id = req.userId ?? null;
	const user = id ? USERS[id] ?? { id } : null;
	res.json({ user });
};

// Admin: get all users
export const getUsers = (req: Request, res: Response) => {
	const list = Object.values(USERS);
	res.json({ users: list });
};

// Admin: get user by id
export const getUserById = (req: Request, res: Response) => {
	const { id } = req.params;
	const user = USERS[id];
	if (!user) return res.status(404).json({ error: 'User not found' });
	return res.json({ user });
};

export default { me, getUsers, getUserById };
