import { type FormEvent, useState } from 'react';
import type { ItemPopulated as Item } from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { FormField, TextInput, TextArea } from '@/components/ui/form-field';
import {
  validateMultiBorrowForm,
  type MultiBorrowFormState,
  type MultiBorrowValidationErrors,
} from '@/features/items/validation/borrowValidation';

type Props = {
  open: boolean;
  availableItems: Item[];
  form: MultiBorrowFormState;
  currentImageIndex: number;
  onFormChange: (form: MultiBorrowFormState) => void;
  onImageIndexChange: (index: number) => void;
  onAddItem: (item: Item) => void;
  onUpdateItemQuantity: (itemId: string, delta: number) => void;
  onSubmit: (data: MultiBorrowFormState) => void;
  onClose: () => void;
};

export function MultiBorrowModal({
  open,
  availableItems,
  form,
  currentImageIndex,
  onFormChange,
  onImageIndexChange,
  onAddItem,
  onUpdateItemQuantity,
  onSubmit,
  onClose,
}: Props) {
  const [errors, setErrors] = useState<MultiBorrowValidationErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateMultiBorrowForm(form);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit(form);
    setErrors({});
  };

  const handleFormChange = (updatedForm: MultiBorrowFormState) => {
    onFormChange(updatedForm);
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleCloseModal = () => {
    setErrors({});
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => (isOpen ? undefined : handleCloseModal())}>
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="relative w-full overflow-hidden rounded-lg border border-input bg-muted">
                <img
                  src={availableItems[currentImageIndex]?.avatar}
                  alt={availableItems[currentImageIndex]?.name}
                  className="w-full h-44 object-cover"
                />
                {availableItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => onImageIndexChange(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onImageIndexChange(Math.min(availableItems.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === availableItems.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {availableItems.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onImageIndexChange(idx)}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground text-center">
                {availableItems[currentImageIndex]?.name}
              </AlertDialogTitle>
              <button
                type="button"
                onClick={() => {
                  const item = availableItems[currentImageIndex];
                  if (item) {
                    onAddItem(item);
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity mx-auto bg-primary text-primary-foreground hover:opacity-90"
              >
                Add item
              </button>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <FormField label="Full Name" error={errors.fullName}>
                <TextInput
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleFormChange({ ...form, fullName: e.target.value })}
                  placeholder="Juan Dela Cruz"
                  error={errors.fullName}
                />
              </FormField>

              <div className="grid gap-1">
                <label className="text-sm font-semibold text-foreground">Items</label>
                <div className="space-y-2">
                  {form.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No items added yet. Add items from the carousel above.</p>
                  ) : (
                    form.items.map((entry) => {
                      const itemId = entry.item.id!;
                      const isQuantityInvalid = entry.quantity < 1 || entry.quantity > entry.item.quantity;
                      return (
                        <div key={itemId} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground">{entry.item.name}</span>
                            {isQuantityInvalid && (
                              <span className="text-xs text-destructive">
                                {entry.quantity < 1 ? 'Quantity must be at least 1' : `Max ${entry.item.quantity} available`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(itemId, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-destructive text-destructive-foreground text-lg font-bold hover:opacity-90 transition-opacity"
                            >
                              −
                            </button>
                            <span className={`w-8 text-center text-sm font-semibold ${isQuantityInvalid ? 'text-destructive' : ''}`}>
                              {entry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(itemId, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-success text-success-foreground text-lg font-bold hover:opacity-90 transition-opacity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {errors.items && <p className="text-xs text-red-500 mt-1">{errors.items}</p>}
              </div>

              <FormField label="Return Date" error={errors.returnDate}>
                <TextInput
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => handleFormChange({ ...form, returnDate: e.target.value })}
                  error={errors.returnDate}
                />
              </FormField>

              <FormField label="Purpose" error={errors.purpose}>
                <TextArea
                  value={form.purpose}
                  onChange={(e) => handleFormChange({ ...form, purpose: e.target.value })}
                  placeholder="Briefly describe how you will use this item"
                  error={errors.purpose}
                />
              </FormField>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>Urgent Borrow?</span>
              <button
                type="button"
                onClick={() => handleFormChange({ ...form, urgent: !form.urgent })}
                className="h-6 w-12 rounded-full border border-input flex items-center px-1 transition-colors"
                style={{
                  backgroundColor: form.urgent ? 'var(--primary)' : 'var(--muted)',
                }}
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
                className="px-4 py-2 rounded-lg border border-input text-foreground hover:bg-muted"
                onClick={handleCloseModal}
              >
                Cancel
              </AlertDialogCancel>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 ${
                  form.urgent ? 'bg-warning text-warning-foreground' : 'bg-primary text-primary-foreground'
                }`}
              >
                {form.urgent ? 'Urgent Borrow' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
