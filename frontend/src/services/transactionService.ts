import { api } from '@/lib/apiClient';
import type {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
} from '@schemas/transactionSchema';

type TransactionsResponse = { transactions: Transaction[] };
type TransactionResponse = { transaction: Transaction };

export const transactionService = {
  async createTransaction(payload: TransactionCreate): Promise<Transaction> {
    const { transaction } = await api.post<TransactionResponse>(
      '/transactions',
      payload
    );

    return transaction;
  },

  async getTransactions(params?: { status?: string }): Promise<Transaction[]> {
    const { transactions } = await api.get<TransactionsResponse>(
      '/transactions',
      {
        params,
      }
    );
    return transactions;
  },

  async getTransactionsForMe(): Promise<Transaction[]> {
    const { transactions } =
      await api.get<TransactionsResponse>('/transactions/me');
    return transactions;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const { transaction } = await api.get<TransactionResponse>(
      `/transactions/${id}`
    );
    return transaction;
  },

  async updateTransaction(
    id: string,
    data: TransactionUpdate
  ): Promise<Transaction> {
    const { transaction } = await api.put<TransactionResponse>(
      `/transactions/${id}`,
      data
    );
    return transaction;
  },
};
