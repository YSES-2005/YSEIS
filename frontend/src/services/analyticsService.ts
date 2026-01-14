import { api } from '@/lib/apiClient';

export type BorrowingTrendItem = {
  date: string;
  borrowed: number;
  borrowedTransactions: number;
  returned: number;
  returnedTransactions: number;
};

export type BorrowingTrendsResponse = {
  data: BorrowingTrendItem[];
  groupBy: 'day' | 'week' | 'month';
};

export type GroupBy = 'day' | 'week' | 'month';

export const analyticsService = {
  async getBorrowingTrends(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: GroupBy;
  }): Promise<BorrowingTrendsResponse> {
    const query: Record<string, string> = {};
    if (params?.startDate) query.startDate = params.startDate;
    if (params?.endDate) query.endDate = params.endDate;
    if (params?.groupBy) query.groupBy = params.groupBy;

    const response = await api.get<BorrowingTrendsResponse>(
      '/analytics/borrowing-trends',
      { params: query }
    );

    return response;
  },
};
