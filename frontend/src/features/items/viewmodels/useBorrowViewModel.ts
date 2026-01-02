import { useState } from 'react';
import {
  borrowFormSchema,
  type BorrowFormData,
  type ItemPopulated as Item,
} from '@schemas/itemSchema';

type BorrowValidationErrors = Partial<Record<keyof BorrowFormData, string>>;

export function useBorrowViewModel({
  item,
  onSubmit,
}: {
  item: Item | null;
  onSubmit: (data: BorrowFormData) => void;
}) {
  const [form, setForm] = useState<BorrowFormData>({
    fullName: '',
    quantity: 1,
    returnDate: '',
    purpose: '',
    urgent: false,
  });
  const [errors, setErrors] = useState<BorrowValidationErrors>({});

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
    if (!validate()) return;
    onSubmit(form);
    reset();
  };

  const reset = () => {
    setForm({
      fullName: '',
      quantity: 1,
      returnDate: '',
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
  };
}
