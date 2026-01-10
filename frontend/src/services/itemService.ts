import { apiClient } from '@/lib/apiClient';
import type { ItemPopulated } from '@schemas/itemSchema';

type ApiResponse<T> = { 
  data: T;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

export type GetItemsParams = {
  search?: string;
  status?: 'available' | 'unavailable';
  type?: string | null;
  custodian?: string;
  startDate?: string; 
  endDate?: string;
  page?: number;
  limit?: number;
};

export const itemService = {
  async getItems(params?: GetItemsParams): Promise<ApiResponse<ItemPopulated[]>> {
    const query: Record<string, string | number> = {};
    if (params?.search) query.search = params.search;
    if (params?.status) query.status = params.status;
    if (params?.type) query.type = params.type;
    if (params?.custodian) query.custodian = params.custodian;
    if (params?.startDate) query.startDate = params.startDate;
    if (params?.endDate) query.endDate = params.endDate;
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;

    const res = await apiClient.get<ApiResponse<ItemPopulated[]>>('/items', {
      params: query,
    });

    const response = res as unknown as ApiResponse<ItemPopulated[]>;
    return {
      data: Array.isArray(response.data) ? response.data : [],
      pagination: response.pagination,
    };
  },
};

export default itemService;
