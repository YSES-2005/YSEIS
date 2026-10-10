import { queryClient } from '@/lib/queryClient';
import { transactionService } from '@/services/transactionService';
import type { ItemPopulated as Item } from '@schemas/itemSchema';
import {
  multiBorrowFormSchema,
  type MultiBorrowFormState,
} from '@schemas/itemSchema';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type MultiBorrowValidationErrors = Partial<
  Record<keyof MultiBorrowFormState, string>
>;

const normalizeToSchemaItem = (item: Item) => ({
  ...item,
  custodian:
    typeof item.custodian === 'string'
      ? item.custodian
      : item.custodian?.name || '',
});

type MultiBorrowItemEntry = {
  item: {
    id?: string;
    avatar: string;
    name: string;
    type: string;
    quantity: number;
    location: string;
    status: 'available' | 'unavailable' | 'deleted';
    custodian: string | { name?: string; email?: string };
    created_at?: Date;
    updated_at?: Date;
  };
  quantity: number;
};

export function useMultiBorrowViewModel({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<MultiBorrowFormState>({
    items: [],
    returnDate: undefined,
    purpose: '',
    urgent: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState<MultiBorrowValidationErrors>({});

  const createMultiTransactionMutation = useMutation({
    mutationFn: async (data: MultiBorrowFormState) => {
      const returnDate = data.returnDate
        ? new Date(data.returnDate)
        : new Date();
      const transactions = await Promise.all(
        data.items.map(entry =>
          transactionService.createTransaction({
            item: entry.item.id!,
            quantity: entry.quantity,
            purpose: data.purpose,
            urgency: data.urgent,
            returnDate,
            approvalStatus: 'pending',
          })
        )
      );
      return transactions;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-me'] });
      toast.success(
        variables.items.length === 1
          ? 'Borrow request submitted successfully'
          : `${variables.items.length} borrow requests submitted successfully`
      );
      onSuccess?.();
    },
  });

  const setField = <K extends keyof MultiBorrowFormState>(
    field: K,
    value: MultiBorrowFormState[K]
  ) => {
    setForm((f: MultiBorrowFormState) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e: MultiBorrowValidationErrors) => ({
        ...e,
        [field]: undefined,
      }));
    }
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    setForm((prev: MultiBorrowFormState) => ({
      ...prev,
      items: prev.items
        .map((entry: MultiBorrowItemEntry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry: MultiBorrowItemEntry) => entry.quantity > 0),
    }));
  };

  const addItem = (item: Item) => {
    const itemId = item.id!;
    const normalizedItem = normalizeToSchemaItem(item);
    setForm((prev: MultiBorrowFormState) => {
      const exists = prev.items.some(
        (entry: MultiBorrowItemEntry) => entry.item.id === itemId
      );
      if (!exists) {
        return {
          ...prev,
          items: [...prev.items, { item: normalizedItem, quantity: 1 }],
        };
      }
      return prev;
    });
  };

  const validate = (): boolean => {
    const result = multiBorrowFormSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors = result.error.flatten().fieldErrors;
    const extractedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, val]: [string, unknown]) => [
        key,
        (val as string[] | undefined)?.[0],
      ])
    ) as MultiBorrowValidationErrors;
    setErrors(extractedErrors);
    return false;
  };

  const submit = () => {
    if (!validate()) return;
    createMultiTransactionMutation.mutate(form);
    reset();
  };

  const reset = () => {
    setForm({
      items: [],
      returnDate: undefined,
      purpose: '',
      urgent: false,
    });
    setCurrentImageIndex(0);
    setErrors({});
  };

  const syncWithSelection = (selectedItems: Item[]) => {
    setForm((prev: MultiBorrowFormState) => {
      const currentItemsMap = new Map(
        prev.items.map((i: MultiBorrowItemEntry) => [i.item.id, i])
      );
      const newItems = selectedItems.map(item => {
        const existing = currentItemsMap.get(item.id);
        if (existing) return existing;
        return { item: normalizeToSchemaItem(item), quantity: 1 };
      });
      return { ...prev, items: newItems };
    });
  };

  return {
    form,
    errors,
    currentImageIndex,
    setField,
    updateItemQuantity,
    addItem,
    submit,
    reset,
    setCurrentImageIndex,
    syncWithSelection,
    isLoading: createMultiTransactionMutation.isPending,
  };
}
