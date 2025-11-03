import { Request, Response } from 'express';

// placeholder lang for dev
const STORE: Record<string, any> = {};

// Helper to create a random id 
const nextId = (prefix = 'tx') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

// GET /api/transactions?status=pending this is for admin
export const getTransactions = (req: Request, res: Response) => {
	const status = req.query.status as string | undefined;
	const items = Object.values(STORE);

	if (!status) {
		return res.json({ transactions: items });
	}
	const filtered = items.filter((t) => t.status === status);
	return res.json({ transactions: filtered });
};

// GET /api/transactions/me (authenticated user)
export const getTransactionsForMe = (req: Request, res: Response) => {

	const uid = req.userId as string | null;
	const items = Object.values(STORE).filter((t: any) => t.requestedBy === uid);
	return res.json({ transactions: items });
};

// GET /api/transactions/:id
export const getTransactionById = (req: Request, res: Response) => {
	const { id } = req.params;
	const t = STORE[id];
	if (!t){ 
		return res.status(404).json({ error: 'Not found' });
	}
	return res.json({ transaction: t });
};

// POST /api/transactions this is for creating borrow request
export const createTransaction = (req: Request, res: Response) => {
	// expects { items: [{itemId, qty}], requestedUntil }
	const payload = req.body;

	const requestedBy = req.userId ?? null;

	const id = nextId();
	const created = {
		id,
		items: payload?.items ?? [],
		requestedBy,
		status: 'pending',
		createdAt: new Date().toISOString(),
	};

	STORE[id] = created;
	return res.status(201).json({ transaction: created });
};

// PUT /api/transactions/:id, admin can update status of the item 
export const updateTransaction = (req: Request, res: Response) => {
	const { id } = req.params;
	const payload = req.body;

	const existing = STORE[id];
	if (!existing) return res.status(404).json({ error: 'Not found' });

	const role = req.userRole as string | undefined;
	const uid = req.userId as string | undefined;

	// If trying to change status (approve/reject) this is for the admin side
	if (payload.status) {
		if (role !== 'admin'){ 
			return res.status(403).json({ error: 'Admin required to change status' });
		}
		if (!['approved', 'rejected', 'pending'].includes(payload.status)) {
			return res.status(400).json({ error: 'Invalid status' });
		}
		existing.status = payload.status;
	}

	// If user marks returned, allow only owner
	if (payload.returned === true) {
		if (uid !== existing.requestedBy && role !== 'admin') {
			return res.status(403).json({ error: 'Not allowed' });
		}
		existing.returned = true;
		existing.returnedAt = new Date().toISOString();
	}

	STORE[id] = { ...existing };
	return res.json({ transaction: STORE[id] });
};

export default { getTransactions, getTransactionsForMe, getTransactionById, createTransaction, updateTransaction };
