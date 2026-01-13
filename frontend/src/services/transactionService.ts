import { api } from '@/lib/apiClient';
import type {
  TransactionPopulated,
  TransactionCreate,
  TransactionUpdate,
} from '@schemas/transactionSchema';

type TransactionsResponse = {
  transactions: TransactionPopulated[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

type TransactionResponse = { transaction: TransactionPopulated };

export const transactionService = {
  async createTransaction(
    payload: TransactionCreate
  ): Promise<TransactionPopulated> {
    const { transaction } = await api.post<TransactionResponse>(
      '/transactions',
      payload
    );

    return transaction;
  },

  async getTransactions(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: TransactionPopulated[];
    pagination?: TransactionsResponse['pagination'];
  }> {
    const { transactions, pagination } = await api.get<TransactionsResponse>(
      '/transactions',
      {
        params,
      }
    );
    return { transactions, pagination };
  },

  async getTransactionsForMe(): Promise<TransactionPopulated[]> {
    const { transactions } =
      await api.get<TransactionsResponse>('/transactions/me');
    return transactions;
  },

  async getTransactionById(id: string): Promise<TransactionPopulated> {
    const { transaction } = await api.get<TransactionResponse>(
      `/transactions/${id}`
    );
    return transaction;
  },

  async updateTransaction(
    id: string,
    data: TransactionUpdate
  ): Promise<TransactionPopulated> {
    const { transaction } = await api.put<TransactionResponse>(
      `/transactions/${id}`,
      data
    );
    return transaction;
  },
};
