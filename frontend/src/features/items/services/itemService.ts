import { apiClient } from '@/lib/apiClient';
import type { Item } from '@schemas/itemSchema';

export const itemService = {
  async getItems(): Promise<Item[]> {
    const res = (await apiClient.get<any>('/items')) as unknown;

    let items: any[] = [];
    if (Array.isArray(res)) items = res;
    else if (res && Array.isArray((res as any).data)) items = (res as any).data;
    else if (res && Array.isArray((res as any).items)) items = (res as any).items;

    return items.map((item: any) => ({
      ...item,
      custodian:
        item.custodian && typeof item.custodian === 'object'
          ? item.custodian.name || item.custodian.email || 'Unknown'
          : item.custodian,
    })) as Item[];
  }
};

export default itemService;
