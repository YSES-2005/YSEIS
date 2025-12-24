import { useEffect, useState } from 'react';
import type { ItemPopulated as Item } from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { FormField, TextInput, TextArea } from '@/components/ui/form-field';
import {
  validateBorrowForm,
  type BorrowFormData,
  type BorrowValidationErrors,
} from '@/features/items/validation/borrowValidation';

type Props = {
  open: boolean;
  item: Item | null;
  onSubmit: (data: BorrowFormData) => void;
  onClose: () => void;
};

const defaultForm: BorrowFormData = {
  fullName: '',
  quantity: 1,
  returnDate: '',
  purpose: '',
  urgent: false,
};

export function BorrowModal({ open, item, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<BorrowFormData>(defaultForm);
  const [errors, setErrors] = useState<BorrowValidationErrors>({});

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setErrors({});
    }
  }, [open]);

  if (!item) return null;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateBorrowForm(form, item);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit(form);
    setForm(defaultForm);
    setErrors({});
  };

  const handleFieldChange = (
    field: keyof Omit<BorrowFormData, 'urgent'>,
    value: unknown
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field as keyof BorrowValidationErrors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const primaryLabel = form.urgent ? 'Urgent Borrow' : 'Submit Request';
  const primaryButtonClasses = form.urgent
    ? 'text-gray-900'
    : 'text-white';
  const primaryButtonStyle = form.urgent
    ? {
        backgroundColor: 'var(--borrow-urgent)',
      }
    : {
        backgroundColor: 'var(--borrow-primary)',
      };
  const primaryButtonHoverStyle = form.urgent
    ? {
        backgroundColor: 'var(--borrow-urgent-hover)',
      }
    : {
        backgroundColor: 'var(--borrow-primary-hover)',
      };
  const urgentTrackClasses = form.urgent ? '' : 'bg-gray-200';
  const urgentTrackStyle = form.urgent
    ? { backgroundColor: 'var(--borrow-primary)' }
    : undefined;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => (isOpen ? undefined : onClose())}>
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={handleFormSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img src={item.avatar} alt={item.name} className="w-full h-44 object-cover" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">
                {item.name}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 text-center">
                {/* fill out the form to submit borrow request. */}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <FormField label="Full Name" error={errors.fullName}>
                <TextInput
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="Juan Dela Cruz"
                  error={errors.fullName}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Quantity" error={errors.quantity}>
                  <TextInput
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => handleFieldChange('quantity', Number(e.target.value))}
                    placeholder="Quantity"
                    error={errors.quantity}
                  />
                </FormField>
                <FormField label="Return Date" error={errors.returnDate}>
                  <TextInput
                    type="date"
                    value={form.returnDate}
                    onChange={(e) => handleFieldChange('returnDate', e.target.value)}
                    error={errors.returnDate}
                  />
                </FormField>
              </div>

              <FormField label="Purpose" error={errors.purpose}>
                <TextArea
                  value={form.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  placeholder="Briefly describe how you will use this item"
                  error={errors.purpose}
                />
              </FormField>
            </div>
          </div>

          <div className="border-t px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <span>Urgent Borrow?</span>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, urgent: !f.urgent }))}
                className={`h-6 w-12 rounded-full border border-gray-200 flex items-center px-1 transition-colors ${urgentTrackClasses}`}
                style={urgentTrackStyle}
                aria-pressed={form.urgent}
                aria-label="Toggle urgent borrow"
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    form.urgent ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <AlertDialogCancel
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </AlertDialogCancel>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${primaryButtonClasses}`}
                style={{
                  ...primaryButtonStyle,
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, primaryButtonHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, primaryButtonStyle);
                }}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
