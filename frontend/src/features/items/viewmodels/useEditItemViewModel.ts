import { queryClient } from '@/lib/queryClient';
import { itemService } from '@/services/itemService';
import { updateItemSchema } from '@yseis/shared/itemSchema';
import type {
  ItemPopulated as Item,
  ItemUpdate as SchemaUpdateItem,
} from '@yseis/shared/itemSchema';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type EditItemValidationErrors = Partial<Record<keyof SchemaUpdateItem, string>>;

export function useEditItemViewModel({
  item,
  onSuccess,
}: {
  item: Item | null;
  onSuccess?: (item: Item) => void;
}) {
  const [form, setForm] = useState<SchemaUpdateItem>({
    avatar: item?.avatar,
    name: item?.name,
    type: item?.type,
    quantity: item?.quantity,
    custodian: item?.custodian.id,
    location: item?.location,
  });
  const [errors, setErrors] = useState<EditItemValidationErrors>({});

  const updateItemMutation = useMutation({
    mutationFn: (data: { id: string; payload: SchemaUpdateItem }) =>
      itemService.updateItem(data.id, data.payload),
    onSuccess: (data: Item) => {
      // Refetch current paginated items queries so pagination and counts are updated
      void queryClient.refetchQueries({ queryKey: ['items'], type: 'all' });
      void queryClient.refetchQueries({ queryKey: ['borrows'], type: 'all' });
      toast.success('Item updated successfully');
      setErrors({});
      onSuccess?.(data);
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).message
          : 'Failed to update item';
      toast.error(message);
    },
  });

  const setField = <K extends keyof SchemaUpdateItem>(
    field: K,
    value: SchemaUpdateItem[K] | undefined
  ) => {
    setForm(f => ({
      ...f,
      [field]:
        field === 'custodian' && (value === '' || value === undefined)
          ? undefined
          : value,
    }));
    if (errors[field]) {
      setErrors(e => ({ ...e, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    console.log(form);
    const result = updateItemSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      const extractedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(
          ([key, val]: [string, string[] | undefined]) => [key, val?.[0]]
        )
      ) as EditItemValidationErrors;

      setErrors(extractedErrors);
      return false;
    }
  };

  const submit = () => {
    if (!validate() || !item) return;
    updateItemMutation.mutate({ id: item.id ?? '', payload: form });
  };

  const reset = () => {
    setForm({
      avatar: item?.avatar,
      name: item?.name,
      type: item?.type,
      quantity: item?.quantity,
      custodian: item?.custodian.id,
      location: item?.location,
    });
    setErrors({});
  };

  return {
    form,
    errors,
    setField,
    submit,
    reset,
  };
}
