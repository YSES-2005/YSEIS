import { useState } from 'react';
import type {
  ItemPopulated as Item,
  Item as SchemaItem,
} from '@schemas/itemSchema';
import {
  multiBorrowFormSchema,
  type MultiBorrowFormState,
} from '@schemas/itemSchema';

type MultiBorrowValidationErrors = Partial<
  Record<keyof MultiBorrowFormState, string>
>;

const normalizeToSchemaItem = (item: Item): SchemaItem => ({
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
  onSubmit,
}: {
  onSubmit: (data: MultiBorrowFormState) => void;
}) {
  const [form, setForm] = useState<MultiBorrowFormState>({
    fullName: '',
    items: [],
    returnDate: '',
    purpose: '',
    urgent: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState<MultiBorrowValidationErrors>({});

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
      items: prev.items.map((entry: MultiBorrowItemEntry) =>
        entry.item.id === itemId
          ? { ...entry, quantity: Math.max(1, entry.quantity + delta) }
          : entry
      ),
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
      Object.entries(fieldErrors).map(
        ([key, val]: [string, string[] | undefined]) => [key, val?.[0]]
      )
    ) as MultiBorrowValidationErrors;
    setErrors(extractedErrors);
    return false;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit(form);
    reset();
  };

  const reset = () => {
    setForm({
      fullName: '',
      items: [],
      returnDate: '',
      purpose: '',
      urgent: false,
    });
    setCurrentImageIndex(0);
    setErrors({});
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
  };
}
