import { api } from '@/lib/apiClient';
import type {
  TransactionPopulated,
  TransactionCreate,
  TransactionUpdate,
  Transaction,
} from '@yseis/shared/transactionSchema';

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

export type MostBorrowedItem = {
  name: string;
  avatar: string;
  totalBorrowed: number;
  transactionCount: number;
};

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
    status?: Transaction['approvalStatus'];
    search?: string;
    type?: string;
    borrower?: string;
    startDate?: string;
    endDate?: string;
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

  async getTransactionsForMe(params?: {
    status?: string;
    search?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ transactions: TransactionPopulated[] }> {
    const { transactions } = await api.get<TransactionsResponse>(
      '/transactions/me',
      {
        params,
      }
    );
    return { transactions };
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

  async getMostBorrowedItem(): Promise<MostBorrowedItem | null> {
    const response = await api.get<MostBorrowedItem | null>(
      '/transactions/analytics/most-borrowed'
    );
    return response;
  },
};
