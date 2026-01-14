import { queryClient } from '@/lib/queryClient';
import { itemService } from '@/services/itemService';
import { itemSchema } from '@schemas/itemSchema';
import type {
  ItemPopulated as Item,
  Item as SchemaItem,
} from '@schemas/itemSchema';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type CreateItemValidationErrors = Partial<Record<keyof SchemaItem, string>>;

const defaultForm: SchemaItem = {
  avatar: '',
  name: '',
  type: '',
  quantity: 0,
  custodian: '',
  location: '',
  status: 'available',
};

export function useCreateItemViewModel({
  onSuccess,
}: {
  onSuccess?: (item: Item) => void;
} = {}) {
  const [form, setForm] = useState<SchemaItem>({ ...defaultForm });
  const [errors, setErrors] = useState<CreateItemValidationErrors>({});

  const createItemMutation = useMutation({
    mutationFn: (payload: SchemaItem) => itemService.createItem(payload),
    onSuccess: (data: Item) => {
      // Refetch current paginated items queries so pagination and counts are updated
      void queryClient.refetchQueries({ queryKey: ['items'], type: 'all' });
      toast.success('Item created successfully');
      setForm({ ...defaultForm });
      setErrors({});
      onSuccess?.(data);
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).message
          : 'Failed to create item';
      toast.error(message);
    },
  });

  const setField = <K extends keyof SchemaItem>(
    field: K,
    value: SchemaItem[K] | undefined
  ) => {
    setForm(f => ({
      ...f,
      [field]:
        field === 'custodian' && (value === '' || value === undefined)
          ? undefined
          : value,
    }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const result = itemSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const extractedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(
        ([key, val]: [string, string[] | undefined]) => [key, val?.[0]]
      )
    ) as CreateItemValidationErrors;

    setErrors(extractedErrors);
    return false;
  };

  const submit = () => {
    if (!validate()) return;
    createItemMutation.mutate(form);
  };

  const reset = () => {
    setForm({ ...defaultForm });
    setErrors({});
  };

  return {
    form,
    errors,
    setField,
    submit,
    reset,
    isLoading: createItemMutation.isPending,
  } as const;
}
