import { api } from '@/lib/apiClient';
import type { ItemPopulated } from '@schemas/itemSchema';
import type { ApiResponse } from '@schemas/apiTypes';

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
  async getItems(
    params?: GetItemsParams
  ): Promise<ApiResponse<ItemPopulated[]>> {
    const query: Record<string, string | number> = {};
    if (params?.search) query.search = params.search;
    if (params?.status) query.status = params.status;
    if (params?.type) query.type = params.type;
    if (params?.custodian) query.custodian = params.custodian;
    if (params?.startDate) query.startDate = params.startDate;
    if (params?.endDate) query.endDate = params.endDate;
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;

    const response = await api.get<ApiResponse<ItemPopulated[]>>('/items', {
      params: query,
    });

    return {
      data: Array.isArray(response.data) ? response.data : [],
      pagination: response.pagination,
    };
  },

  async getItemById(id: string): Promise<ItemPopulated> {
    const { item } = await api.get<{ item: ItemPopulated }>(`/items/${id}`);

    return item;
  },
};
