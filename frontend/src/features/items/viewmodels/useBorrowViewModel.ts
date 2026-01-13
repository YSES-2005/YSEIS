import { queryClient } from '@/lib/queryClient';
import { transactionService } from '@/services/transactionService';
import {
  borrowFormSchema,
  type BorrowFormData,
  type ItemPopulated as Item,
} from '@schemas/itemSchema';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type BorrowValidationErrors = Partial<Record<keyof BorrowFormData, string>>;

export function useBorrowViewModel({
  item,
  onSuccess,
}: {
  item: Item | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<BorrowFormData>({
    quantity: 1,
    returnDate: undefined,
    purpose: '',
    urgent: false,
  });
  const [errors, setErrors] = useState<BorrowValidationErrors>({});

  const createTransactionMutation = useMutation({
    mutationFn: (data: {
      item: string;
      quantity: number;
      purpose: string;
      urgency: boolean;
      returnDate: Date;
    }) =>
      transactionService.createTransaction({
        item: data.item,
        quantity: data.quantity,
        purpose: data.purpose,
        urgency: data.urgency,
        returnDate: data.returnDate,
        approvalStatus: 'pending',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-me'] });
      toast.success('Borrow request submitted successfully');
      onSuccess();
    },
  });

  const setField = <K extends keyof BorrowFormData>(
    field: K,
    value: BorrowFormData[K]
  ) => {
    setForm((f: BorrowFormData) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e: BorrowValidationErrors) => ({ ...e, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const result = borrowFormSchema
      .refine(
        (data: BorrowFormData) => data.quantity <= (item?.quantity || 0),
        {
          message: `Cannot borrow more than ${item?.quantity || 0} available`,
          path: ['quantity'],
        }
      )
      .safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const extractedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(
        ([key, val]: [string, string[] | undefined]) => [key, val?.[0]]
      )
    ) as BorrowValidationErrors;
    setErrors(extractedErrors);
    return false;
  };

  const submit = () => {
    if (!validate() || !item?.id) return;

    createTransactionMutation.mutate({
      item: item.id,
      quantity: form.quantity,
      purpose: form.purpose,
      urgency: form.urgent,
      returnDate: form.returnDate!,
    });
    reset();
  };

  const reset = () => {
    setForm({
      quantity: 1,
      returnDate: undefined,
      purpose: '',
      urgent: false,
    });
    setErrors({});
  };

  return {
    form,
    errors,
    setField,
    submit,
    reset,
    isLoading: createTransactionMutation.isPending,
  };
}
